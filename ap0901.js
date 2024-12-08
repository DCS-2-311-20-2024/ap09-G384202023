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
import { makeFishYatai } from './building.js';
import { makeFoodYatai } from './building.js';
import { makeGunYatai } from './building.js';
import { makeTakadai } from './building.js';
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {
    background: false, // 背景
    follow: false, // 前後左右
    tuiseki: false, // 追跡
    birdsEye: false, // 俯瞰
    course1: false,//npcコース1
    course2: false,//npcコース2
    axes: false, // 座標軸
    freeView: true, //自由視点////変更点
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "background").name("背景(床が映らない)");
  //gui.add(param, "follow").name("一人称視点(未実装)");
  gui.add(param, "follow").name("前後左右に回転")
  .onChange(() => {
    if (param.follow) {
      orbitControls.enabled = false;
    } else {
      orbitControls.enabled = true;
    }
  });
  gui.add(param, "tuiseki").name("一人称視点(追跡)");
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
  const spotLight = new THREE.SpotLight(0xffffff, 10000);
  spotLight.position.set(0, 500, 0);
  spotLight.castShadow = true;////
  scene.add(spotLight);

  // meとnpc、たてもの追加
  const npc1 = makeCBRobot();
  const npc2 = makeCBRobot();
  const me = makeme();
  me.position.y = -5;
  scene.add(npc1);
  scene.add(npc2);
  me.castShadow = true;
  me.receiveShadow = true;
  scene.add(me);
  const npc3 = makeCBRobot();
  const npc4 = makeCBRobot();
  const npc5 = makeCBRobot();
  const npc6 = makeCBRobot();
  const npc7 = makeCBRobot();
  npc3.position.set(20,-5,20);
  npc4.position.set(-40,-5,40);
  npc5.position.set(-70,-5,60);
  npc6.position.set(40,-5,45);
  npc7.position.set(120,-5,80);
  npc3.rotation.set(0,Math.PI/4,0);
  npc4.rotation.set(0,-Math.PI/6,0);
  npc5.rotation.set(0,0,0);
  npc6.rotation.set(0,Math.PI/2,0);
  scene.add(npc3);
  scene.add(npc4);
  scene.add(npc5);
  scene.add(npc6);
  scene.add(npc7);
  // カメラの作成
  //一人称視点の有力な情報を取得
  //https://qiita.com/cranpun/items/bbb3f35cd21b03f9d290
  const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth/window.innerHeight, 0.1, 1000);
  //普段はこれ↓
  //camera.position.set(me.position.x, me.position.y+5, me.position.z-10);
  //確認したいときはこれ↓
  camera.position.set(50,50,50);

  
  
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
    const spotLight = new THREE.PointLight(0xffffff, 8000);
    spotLight.position.set(0, 100, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);
  }

  // 構造物の作成 meshlambertの関係でこれしか建物が建てられない。
  // 多分紅白のついてるやつは無理なだけかも。
const allYataiGroup = new THREE.Group();
const FishYatai1 = makeFishYatai();
FishYatai1.position.set(-35, -5, -30);
FishYatai1.rotation.y = Math.PI / 2;
allYataiGroup.add(FishYatai1);
const FoodYatai1 = makeFoodYatai();
FoodYatai1.position.set(-35, -5, 0);
FoodYatai1.rotation.y = Math.PI / 2;
allYataiGroup.add(FoodYatai1);
const GunYatai1 = makeGunYatai();
GunYatai1.position.set(-35, -5, 30);
GunYatai1.rotation.y = Math.PI / 2;
allYataiGroup.add(GunYatai1);

const FishYatai2 = makeFishYatai();
FishYatai2.position.set(35, -5, 30);
FishYatai2.rotation.y = -Math.PI / 2;
allYataiGroup.add(FishYatai2);
const FoodYatai2 = makeFoodYatai();
FoodYatai2.position.set(35, -5, -30);
FoodYatai2.rotation.y = -Math.PI / 2;
allYataiGroup.add(FoodYatai2);
const GunYatai2 = makeGunYatai();
GunYatai2.position.set(35, -5, 0);
GunYatai2.rotation.y = -Math.PI / 2;
allYataiGroup.add(GunYatai2);



// const GunYatai3 = makeGunYatai();
// GunYatai3.position.set(0, -5, 0);
// allYataiGroup.add(GunYatai3);

allYataiGroup.scale.set(1.5, 1.5, 1.5);
allYataiGroup.children.forEach((child) =>{
  child.castShadow = true;
  child.receiveShadow = true;
});
scene.add(allYataiGroup);

const Takadai0 = makeTakadai();
Takadai0.position.set(0,-5,100);
scene.add(Takadai0);
const Takadai1 = makeTakadai();
Takadai1.position.set(120,-20,120)
scene.add(Takadai1);
const Takadai2 = makeTakadai();
Takadai2.position.set(-120,-20,120)
scene.add(Takadai2);
const Takadai3 = makeTakadai();
Takadai3.position.set(120,-20,-120)
scene.add(Takadai3);
const Takadai4 = makeTakadai();
Takadai4.position.set(-120,-20,-120)
scene.add(Takadai4);

//　月
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshStandardMaterial({
  color: 0xffffb3, // 月の色っぽいグレー
  roughness: 0.7, // マットな質感
  metalness: 0.2, // 金属感は少なめ
  bumpScale: 0.05, // 凹凸のスケールを調整
});
const moon = new THREE.Mesh(geometry, material);
moon.position.set(80,150,80);
moon.scale.set(20,20,20);
scene.add(moon);

  // 平面の作成
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 300),
    new THREE.MeshLambertMaterial({ color: 0x7d582e }));
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -5;
  plane.receiveShadow = true; 
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
  const speed = 0.5; // 移動速度を調整
  if(param.follow===false){
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
}
function updateRotation() {
  const direction = new THREE.Vector3();
  if(param.follow){
  if (keyState.up) direction.z += 1; // 前
  if (keyState.down) direction.z -= 1; // 後ろ
  if (keyState.left) direction.x += 1; // 左
  if (keyState.right) direction.x -= 1; // 右

  if (direction.length() > 0) {
    direction.normalize(); // 方向ベクトルを正規化
    const angle = Math.atan2(direction.x, direction.z); // 回転角を計算
    me.rotation.y = angle; // Y軸を中心に回転
  }
}
}

  // 描画関数
  function render() {/////////////////////render
    moveMe(); // キー入力に応じてアバターを移動
    updateRotation(); // アバターの向きを更新
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
    if (param.tuiseki) {
      const faceOffset = new THREE.Vector3(me.position.x,me.position.y+10,me.position.z); // カメラのオフセット位置を調整
      const facePosition = new THREE.Vector3().copy(faceOffset).add(faceOffset.applyQuaternion(me.quaternion));
      camera.position.copy(facePosition);
      /*
      if (param.follow) {
        // アバターの向きをカメラの向きとして設定
        const direction = new THREE.Vector3();
        if (keyState.up) direction.set(0, 0, -1); // 前方
        if (keyState.down) direction.set(0, 0, 1); // 後方
        if (keyState.left) direction.set(-1, 0, 0); // 左
        if (keyState.right) direction.set(1, 0, 0); // 右
    
        if (direction.length() > 0) {
          direction.normalize();
          const targetPosition = new THREE.Vector3().copy(me.position).add(direction.multiplyScalar(10)); // 向きに応じて少し前方に移動
          camera.lookAt(targetPosition);
        }
      }*/

        // アバターの向きを正しくカメラが向くように設定
  const direction = new THREE.Vector3(0, 0, 0).applyQuaternion(me.quaternion);
  const targetPosition = me.position.clone().add(direction);

  camera.lookAt(targetPosition); // カメラがターゲット位置を向くように設定

    
      //camera.up.set(0, 1, 0); // カメラの上をy軸正方向に設定
    }
    
    // 影についての設定
    renderer.shadowMap.enabled = true;
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