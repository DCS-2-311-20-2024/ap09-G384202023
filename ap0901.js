//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G38400-2023 拓殖太郎
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { GUI } from "ili-gui";
import {OrbitControls} from "three/addons";
import { makeCBRobot } from './myavatar.js';
//import { GLTFLoader } from "three/addons";
//import * as L1 from "./ap08L1.js";
//import * as L2 from "./ap08L2.js";
//import * as L3 from "./ap08L3.js";
//import * as L4 from "./ap08L4.js";

// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {
    opacity: 0.5, // 透明度
    background: true, // 背景
    follow: false, // 追跡
    birdsEye: false, // 俯瞰
    course: false,//コース
    axes: false, // 座標軸
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "opacity", 0.0,1.0).name("建物の透明度")
  .onChange(() => {
    buildings.children.forEach((building) => {
      building.material.opacity = param.opacity;
    })
  });
  gui.add(param, "background").name("背景");
  gui.add(param, "follow").name("追跡");
  gui.add(param, "birdsEye").name("俯瞰");
  gui.add(param, "course").name("コース");
  gui.add(param, "axes").name("座標軸");

  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);


  // 光源の設定
  const spotLight = new THREE.SpotLight(0xffffff, 2500);
  spotLight.position.set(-10, 30, 10);
  spotLight.castShadow = true;////
  scene.add(spotLight);

  // カメラの作成
  const camera = new THREE.PerspectiveCamera(
    50, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(10,5,20);
  camera.lookAt(0,0,0);

  
  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, innerHeight);
  renderer.setClearColor(0x102040)
  document.getElementById("output").appendChild(renderer.domElement);

  // カメラの制御
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDumping = true;
  
  // ロボットの追加
  const myavatar = makeCBRobot();
  scene.add(myavatar);

  // 背景の設定
  let renderTarget;
  function setBackground() {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      "fu-rinenter.jpg",
      () => {
        renderTarget
          = new THREE.WebGLCubeRenderTarget(texture.image.height);
        renderTarget.fromEquirectangularTexture(renderer, texture);
        scene.background = renderTarget.texture;
        render();
      }
    )
  }
  setBackground();

  // 光源の設定
  // 環境ライト
  {
    const light = new THREE.AmbientLight();
    light.intensity=2.0;
    scene.add(light);
  }
  // スポットライト
  { 
    const light = new THREE.PointLight(0xffffff, 3000);
    light.position.set(0, 40, 0); 
    light.lookAt(0,0,0);
    scene.add(light);
  }

  // 構造物の作成
  const buildings = new THREE.Group();
  {
    const w = 10;
    const h = 20;
    const d = 10;
    const gap = 30;
    const n = 3;
    for(let c=0;c<n;c++){
      for(let r=0;r<n;r++){
        const building = new THREE.Mesh(
          new THREE.BoxGeometry(w,h,d),
          new THREE.MeshPhongMaterial({
            color: 0x408080,
            opacity: param.opacity,
            transparent: true
          })
        );
        building.position.set(
          (w + gap) * (c - (n-1)/2),
          0,
          (d + gap) * (r - (n-1)/2)
        );

        // 上真ん中と下真ん中は追加しない
        if ((c === 1 && r === 0) || (c === 1 && r === 2)) {
          continue;
        }
        buildings.add(building);
      }
    }
  }
  scene.add(buildings);

  // 平面の作成
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshLambertMaterial({ color: 0x404040 }));
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -5;
  scene.add(plane);

  // 自動操縦コースの設定
  // 制御点
  const controlPoints = [
    [-30, -10, 50],
    [-30, -10, -50],
    [-50, -10, -50],
    [-50, -10, 50],
  ]
  // コースの補間
  const p0 = new THREE.Vector3();
  const p1 = new THREE.Vector3();
  const course = new THREE.CatmullRomCurve3(
    controlPoints.map((p, i) => {
      p0.set(...p);
      p1.set(...controlPoints[(i + 1) % controlPoints.length]);
      return [
        (new THREE.Vector3()).copy(p0),
        (new THREE.Vector3()).lerpVectors(p0, p1, 1/3),
        (new THREE.Vector3()).lerpVectors(p0, p1, 2/3),
      ];
    }).flat(), true
  )

  // コースの描画
  const points = course.getPoints(300);
  const courseObject = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color: "red"})
  );
  scene.add(courseObject);

  // Windowサイズの変更処理
  window.addEventListener("resize", ()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }, false);

  // 描画処理
  // 描画のための変数
  const clock = new THREE.Clock();
  const myavatarPosition = new THREE.Vector3();
  const myavatarTarget = new THREE.Vector3();
  const cameraPosition = new THREE.Vector3();
  // 描画関数
  function render() {
    // myavatar の位置と向きの設定
    const elapsedTime = clock.getElapsedTime() / 30;
    course.getPointAt(elapsedTime % 1, myavatarPosition);
    myavatar.position.copy(myavatarPosition);
    course.getPointAt((elapsedTime+0.01) % 1, myavatarTarget);
    myavatar.lookAt(myavatarTarget);
    // 背景の切り替え
    if(param.background) {
      scene.background = renderTarget.texture;
      plane.visible = false;
    }
    else{
      scene.background = null;
      plane.visible = true;
    }
 
    // カメラの位置の切り替え
    if(param.follow){
      cameraPosition.lerpVectors(myavatarTarget, myavatarPosition, 4);
      camera.position.y += 2.5;
      camera.position.copy(cameraPosition);
      camera.lookAt(myavatar.position);//自分を見る
      camera.up.set(0,1,0);//カメラの上をy軸正の向きにする
    }else if(param.birdsEye){
      camera.position.set(0,150,0);//上空から
      camera.lookAt(myavatar.position);//平面の中央を見る
      camera.up.set(0,0,-1);//カメラの上をz軸負の向きにする
    }
    else{
      camera.position.set(10,-10,10);//下空から
      camera.lookAt(myavatar.position);//飛行機を見る
      camera.up.set(0,1,0);//カメラの上をy軸正の向きにする
    }
    // コース表示の有無
    courseObject.visible = param.course;
    // 座標表示の有無
    axes.visible = param.axes;

    // 描画
    renderer.render(scene, camera);
    // 次のフレームでの描画要請
    requestAnimationFrame(render);
  }
}

init();