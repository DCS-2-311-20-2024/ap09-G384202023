//
// 応用プログラミング 第9回 (ap09L1.js)
//
// G38420-2023 大野彩花
//

"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
//import * as L1 from "../karikakunousuru/ap09L1.js";
import * as L2 from "./ap09L2.js";
//import * as L3 from "../karikakunousuru/ap09L3.js";
//import * as L4 from "../karikakunousuru/ap09L4.js";

let renderer;
let camera;
let course;
export const origin = new THREE.Vector3();
export const controlPoints = [
    [ 50,-20],
    [  5,  0],//追加
    [ 20, 20],//追加
    [-25, 40]
]
export function init(scene, size, id, offset, texture){
    origin.set(offset.x, 0, offset.z);
    camera = new THREE.PerspectiveCamera(20, 1, 0.1, 1000);
    {
      camera.position.set(0, 10, 0);
      camera.lookAt(offset.x, 0, offset.z);
    }
    renderer =  new THREE.WebGLRenderer();
    {
      renderer.setClearColor(0x406080);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(size, size);
    }
    document.getElementById(id).appendChild(renderer.domElement);
    
    // 平面
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 80),
        new THREE.MeshLambertMaterial({color: "green"})
    )
    plane.rotateX(-Math.PI/2);
    plane.position.set(offset.x, -0.01, offset.z);
    scene.add(plane);

    // ビル
    function makeBuilding(x, z, type) {
        const height = [2, 2, 7, 4, 5];
        const bldgH = height [type]*5;
        const geometry = new THREE.BoxGeometry(8, bldgH, 8);
        const material = new THREE.MeshLambertMaterial({map: texture});
        //
        const sideUvS = (type*2+1)/11;
        const sideUvE = (type*2+2)/11;
        const topUvS = (type*2+2)/11;
        const topUvE = (type*2+3)/11;
        const uvs = geometry.getAttribute("uv");
        for (let i=0; i < 48; i+=4) {
            if (i<16 || i > 22) {
                uvs.array[i] = sideUvS;
                uvs.array[i+2] = sideUvE;
            }
            else {
                uvs.array [i] = topUvS;
                uvs.array [i+2] = topUvE;
            }
        }
        //
        const bldg = new THREE.Mesh (
            geometry,
            material
        )
        bldg.position.set(x,bldgH/2,z);//x,zは任意
        scene.add(bldg);
    }
    makeBuilding(-50, -25, 3);
    makeBuilding(-70, -15, 2);
    makeBuilding(-60, -40, 4);
    //自由違法建築物///////////////////////////
    // 立方体の作成
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshPhysicalMaterial({ 
        color: 0xD8BFD8,        
        metalness: 0,           
        roughness: 0,            
        transparency: true,      
        opacity: 0.9,            
        clearcoat: 1,          
        clearcoatRoughness: 0,   
        reflectivity: 1, 
        ior: 1.5 
    });
    const cube = new THREE.Mesh(geometry, material);


    // 立方体の位置を空中に設定
    cube.position.set(-50, 50, 0);
    cube.rotation.x = Math.PI / 4;
    scene.add(cube);
    /////////////////////////////////////////
    // コース(描画)
    // 制御点を補間して曲線を作る
    course = new THREE.CatmullRomCurve3(
        controlPoints.map ((p) => {
            return (new THREE.Vector3()).set (
                offset.x + p[0],
                0,
                offset.z + p[1]
            );
        }), false
    )
    // 曲線から100箇所を取り出し。円を並べる
    const points = course.getPoints (100);
    points.forEach((point) =>{
        const road = new THREE.Mesh(
            new THREE. CircleGeometry(5,16),
            new THREE.MeshLambertMaterial({
            color: "gray",
        })
    )
    road.rotateX(-Math.PI/2);
    road.position.set(
    point.x,
    0, point.z
    );
    scene.add (road);
});
}
// コース(自動運転用)
export function makeCourse(scene){
        const courseVectors = [];
        const parts = [L2, L3, L4, L1];
        parts.forEach ((part) => {
        part.controlPoints.forEach((p) => {
            courseVectors.push(
                new THREE. Vector3(
                    p[0] + part.origin.x,
                    0,
                    p[1]+ part.origin.z,
                )
            )
        });
    })
    course = new THREE.CatmullRomCurve3(
        courseVectors, true
    )
}

// カメラを返す
export function getCamera() {
    return camera;
}

// 車の設定
export function setCar(scene, car) {
    const SCALE = 0.01;
    car.position.copy(origin);
    car.scale.set(SCALE, SCALE, SCALE);
    scene.add(car);
}

// Windowサイズの変更処理
export function resize() {
    camera.updateProjectionMatrix();
    const sizeR = 0.2 * window.innerWidth;
    renderer.setSize(sizeR, sizeR);
}

