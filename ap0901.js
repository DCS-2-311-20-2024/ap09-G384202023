//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G38420-2023 大野彩花
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { GUI } from "ili-gui";
import {OrbitControls} from "three/addons";
import { makeCBRobot } from './myavatar.js';
import { makeme } from './makeme.js';
import { makeYatai } from './myavatar.js';
import { makeFishYatai } from './myavatar.js';
import { makeFoodYatai } from './myavatar.js';
import { makeGunYatai } from './myavatar.js';

// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {
    opacity: 0.5, // 透明度
    background: true, // 背景
    follow: false, // 追跡
    birdsEye: false, // 俯瞰
    course1: false,//npcコース1
    course2: false,//npcコース2
    axes: false, // 座標軸
    freeView: true, //自由視点////変更点
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "opacity", 0.0,1.0).name("建物の透明度(製作者用)")
  .onChange(() => {
    buildings.children.forEach((building) => {
      building.material.opacity = param.opacity;
    })
  });
  
  
  gui.add(param, "background").name("背景(床が映らない)");
  gui.add(param, "follow").name("一人称視点(未実装)");
  gui.add(param, "birdsEye").name("俯瞰(未実装)");
  gui.add(param, "course1").name("コース1");
  gui.add(param, "course2").name("コース2");
  gui.add(param, "axes").name("座標軸");
  gui.add(param, "freeView").name("自由視点原点(製作者確認用)");////変更点

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

  // meとnpc、たてもの追加
  const npc1 = makeCBRobot();
  const npc2 = makeCBRobot();
  const me = makeme();
  me.position.set(0,-5,0);
  scene.add(npc1);
  scene.add(npc2);
  scene.add(me);

  /*
  const FishYatai = makeFishYatai();
  FishYatai.position.set(0,-5,0);
  scene.add(FishYatai);
  */

  /*
  const FoodYatai = makeFoodYatai();
  FoodYatai.position.set(0,-5,0);
  scene.add(FoodYatai);
  */

  
  const GunYatai = makeGunYatai();
  GunYatai.position.set(0,-5,0);
  scene.add(GunYatai);
  



  // カメラの作成
  const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth/window.innerHeight, 0.1, 1000);
  //普段はこれ↓
  //camera.position.set(me.position.x, me.position.y+5, me.position.z-10);
  //確認したいときはこれ↓
  camera.position.set(0, me.position.y+15, me.position.z+20);

  
  
  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, innerHeight);
  renderer.setClearColor(0x102040)
  document.getElementById("output").appendChild(renderer.domElement);

  // カメラの制御変更し、ユーザーが動かせるように
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  

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

  // 構造物の作成///////////////////////////////makeYataiにする
  const buildings = new THREE.Group();
  {
    const w = 20;
    const h = 20;
    const d = 20;
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

        //  真ん中は追加しないが、
        //　低確率で真ん中上に祠を表示する。
        if (c === 1) {
          continue;
        }
        buildings.add(building);
      }
    }
  }
  scene.add(buildings);

  // 平面の作成
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 300),
    new THREE.MeshLambertMaterial({ color: 0x7d582e }));
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -5;
  scene.add(plane);

  /////////////////////////////npc1のコースの設定
  // 制御点
  const controlPoints1 = [
    [-30, -5, 80],
    [-30, -5, -80],
    [-80, -5, -80],
    [-80, -5, 80],
  ]
  // コースの補間
  const p0 = new THREE.Vector3();
  const p1 = new THREE.Vector3();
  const course1 = new THREE.CatmullRomCurve3(
    controlPoints1.map((p, i) => {
      p0.set(...p);
      p1.set(...controlPoints1[(i + 1) % controlPoints1.length]);
      return [
        (new THREE.Vector3()).copy(p0),
        (new THREE.Vector3()).lerpVectors(p0, p1, 1/3),
        (new THREE.Vector3()).lerpVectors(p0, p1, 2/3),
      ];
    }).flat(), true
  )
  /////////////////////////////npc2のコースの設定//////////時間があったら逆回転にする
  // 制御点
  const controlPoints2 = [
    [30, -5, -80],
    [30, -5, 80],
    [80, -5, 80],
    [80, -5, -80]
  ]
  const p2 = new THREE.Vector3();
  const p3 = new THREE.Vector3();
  const course2 = new THREE.CatmullRomCurve3(
    controlPoints2.map((p, i) => {
      p2.set(...p);
      p3.set(...controlPoints2[(i + 1) % controlPoints2.length]);
      return [
        (new THREE.Vector3()).copy(p2),
        (new THREE.Vector3()).lerpVectors(p2, p3, 1/3),
        (new THREE.Vector3()).lerpVectors(p2, p3, 2/3),
      ];
    }).flat(), true
  )
  
///////////////////npcend

  // コースの描画
  const points1 = course1.getPoints(300);
  const points2 = course2.getPoints(300);
  const courseObject1 = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points1),
    new THREE.LineBasicMaterial({ color: "red"})
  );
  const courseObject2 = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points2),
    new THREE.LineBasicMaterial({ color: "blue"})
  );
  scene.add(courseObject1);
  scene.add(courseObject2);

  // Windowサイズの変更処理
  window.addEventListener("resize", ()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }, false);

  // 描画処理
  // 描画のための変数
  const clock = new THREE.Clock();

  const npcPosition1 = new THREE.Vector3();
  const npcTarget1 = new THREE.Vector3();
  const npcPosition2 = new THREE.Vector3();
  const npcTarget2 = new THREE.Vector3();
  const mePosition = new THREE.Vector3();
  const meTarget = new THREE.Vector3();

  const cameraPosition = new THREE.Vector3();



  // キーボードの入力状態を管理するオブジェクト
const keyState = {
  up: false,
  down: false,
  left: false,
  right: false,
};

// キーが押されたときの処理
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w': // 上に移動
      keyState.up = true;
      break;
    case 's': // 下に移動
      keyState.down = true;
      break;
    case 'a': // 左に移動
      keyState.left = true;
      break;
    case 'd': // 右に移動
      keyState.right = true;
      break;
  }
});

// キーが離されたときの処理
document.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'w':
      keyState.up = false;
      break;
    case 's':
      keyState.down = false;
      break;
    case 'a':
      keyState.left = false;
      break;
    case 'd':
      keyState.right = false;
      break;
  }
});

// アバターを動かす関数を定義
function moveMe() {
  const speed = 0.2; // 移動速度を調整
  
  if (keyState.up) {
    me.position.z += speed; // 前方向に移動
  }
  if (keyState.down) {
    me.position.z -= speed; // 後ろ方向に移動
  }
  if (keyState.left) {
    me.position.x += speed; // 左方向に移動
  }
  if (keyState.right) {
    me.position.x -= speed; // 右方向に移動
  }
}

  // 描画関数
  function render() {/////////////////////render

    moveMe(); // キー入力に応じてアバターを移動
  
    // npc の位置と向きの設定
    const elapsedTime = clock.getElapsedTime() / 30;
    course1.getPointAt(elapsedTime % 1, npcPosition1);
    course2.getPointAt(elapsedTime % 1, npcPosition2);
    npc1.position.copy(npcPosition1);
    npc2.position.copy(npcPosition2);
    course1.getPointAt((elapsedTime+0.01) % 1, npcTarget1);
    course2.getPointAt((elapsedTime+0.01) % 1, npcTarget2);
    npc1.lookAt(npcTarget1);
    npc2.lookAt(npcTarget2);
    // 背景の切り替え
    if(param.background) {
      scene.background = renderTarget.texture;
      plane.visible = false;
    }
    else{
      scene.background = null;
      plane.visible = true;
    }
    //////////////////////////////////未実装/////////
    // カメラの位置の切り替え
    // if(param.freeView==false || param.follow){
    //   cameraPosition.lerpVectors(meTarget, mePosition, 0.1);
    //   //camera.position.y += 2.5;
    //   camera.position.copy(cameraPosition);
    //   camera.lookAt(me.position);//自分を見る
    //   camera.up.set(0,1,0);//カメラの上をy軸正の向きにする
    // }else if(param.birdsEye){
    //   camera.position.set(0,150,0);//上空から
    //   camera.lookAt(me.position);//平面の中央を見る
    //   camera.up.set(0,0,-1);//カメラの上をz軸負の向きにする
    // }
    // else{d
    //   camera.position.set(0,0,-10);//下空から/////////////////ここで自分視点で確認できる
    //   camera.lookAt(me.position);//飛行機を見る
    //   camera.up.set(0,1,0);//カメラの上をy軸正の向きにする
    // }
    if (param.follow) {
      // カメラを `me` の顔の位置に配置し、前を向くようにする
      const faceOffset = new THREE.Vector3(me.position.x, me.position.y+10, me.position.z); // 顔の位置を設定
      const facePosition = new THREE.Vector3().copy(me.position).add(faceOffset.clone().applyQuaternion(me.quaternion));
      camera.position.copy(facePosition);
      
      // カメラが前を向くように設定
      //const lookAtTarget = facePosition.clone().add(faceOffset.applyQuaternion(me.quaternion));
      //camera.lookAt(lookAtTarget);
      camera.up.set(0, 1, 0); // カメラの上を y 軸正の向きにする
    } else {
      // `param.follow` が false の場合は自由視点を有効にする
      orbitControls.update(); // カメラを操作できるように
    }
  
    // if (param.follow) {
    //   // カメラを `me` の後ろに設定
    //   camera.position.set(me.position.x, me.position.y + 5, me.position.z);
    //   //sacamera.rotation.set(me.rotation)// = Math.PI/4;
    //   //camera.lookAt(me.position.x, me.position.y + 5, me.position.z+1); // `me` の位置を見る
    // }
    // if(param.follow==false) {
    //   // `param.follow` が false の場合は自由視点を有効にする
    //   //orbitControls.enableDamping = true;
    //   orbitControls.update(); // カメラを操作できるように
    // }


    
    
    // Render関数内
    orbitControls.enabled = param.freeView;
    orbitControls.update();//////////////////////////ここでアップデート
    // コース表示の有無
    courseObject1.visible = param.course1;
    courseObject2.visible = param.course2;
    // 座標表示の有無
    axes.visible = param.axes;
    // 描画
    renderer.render(scene, camera);
    // 次のフレームでの描画要請
    requestAnimationFrame(render);
  }
}

init();