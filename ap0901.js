//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G38420-2023 大野彩花
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { GUI } from "ili-gui";
import { OrbitControls } from "three/addons";
import { makeCBRobot } from './myavatar.js';
import { makeme,  animateMyRobot} from './makeme.js';
import { animateCBRobot } from './myavatar.js';
import { makeFishYatai, makeFoodYatai, makeGunYatai,  makeTakadai} from './building.js';
import { makeDensen } from './densen.js';
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {
    background: false, // 背景
    tuiseki: false, // 追跡
    fps : false,
    birdsEye: false, // 俯瞰
    course1: false,//npcコース1
    course2: false,//npcコース2
    course3: false,//npcコース3
    axes: false, // 座標軸
    freeView: true, //自由視点////変更点
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "background").name("背景(床が映らない)");
  gui.add(param, "tuiseki").name("一人称視点(追跡)");
  //gui.add(param, "fps").name("FPS");
  gui.add(param, "birdsEye").name("俯瞰");
  //gui.add(param, "course1").name("コース1");
  //gui.add(param, "course2").name("コース2");
  gui.add(param, "axes").name("座標軸");
  gui.add(param, "freeView").name("自由視点(原点)");////変更点

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
  const me = makeme();
  me.castShadow = true;
  me.receiveShadow = true;
  const meBoundingBox = new THREE.Box3().setFromObject(me);//変更点
  me.position.set(0,0,-80)
  scene.add(me);

  const allnpc = new THREE.Group();
  const npc1 = makeCBRobot();//move
  const npc2 = makeCBRobot();//move
  const npc3 = makeCBRobot();
  const npc4 = makeCBRobot();
  const npc5 = makeCBRobot();
  const npc6 = makeCBRobot();
  const npc7 = makeCBRobot();
  const npc8 = makeCBRobot();
  const npc9 = makeCBRobot();//move
  const npc10 = makeCBRobot();
  const npc11 = makeCBRobot();
  const npc12 = makeCBRobot();
  const npc13 = makeCBRobot();
  const npc14 = makeCBRobot();
  npc3.position.set(20,0,20);
  npc4.position.set(-40,0,40);
  npc5.position.set(-70,0,60);
  npc6.position.set(40,0,45);
  npc7.position.set(120,0,80);
  npc10.position.set(-120,0,80);
  npc11.position.set(-130,0,80);
  npc12.position.set(-120,0,-80);
  npc13.position.set(-130,0,-80);
  npc14.position.set(120,0,80);
  npc3.rotation.set(0,Math.PI/4,0);
  npc4.rotation.set(0,-Math.PI/6,0);
  npc5.rotation.set(0,0,0);
  npc6.rotation.set(0,Math.PI/2,0);
  npc10.rotation.set(0,-Math.PI/2,0);
  npc11.rotation.set(0,Math.PI/2,0);
  npc12.rotation.set(0,Math.PI,0);
  npc13.rotation.set(0,Math.PI,0);
  npc14.rotation.set(0,0,0);
  allnpc.add(npc1);
  allnpc.add(npc2);
  allnpc.add(npc3);
  allnpc.add(npc4);
  allnpc.add(npc5);
  allnpc.add(npc6);
  allnpc.add(npc7);
  allnpc.add(npc8);
  allnpc.add(npc9);
  allnpc.add(npc10);
  allnpc.add(npc11);
  allnpc.add(npc12);
  allnpc.add(npc13);
  allnpc.add(npc14);

  allnpc.children.forEach((child) =>{
    child.castShadow = true;
    child.receiveShadow = true;
  });
  const npcBoundingBoxes = allnpc.children.map(child => {
    const box = new THREE.Box3().setFromObject(child);////変更点
    return { box, object: child };
  });
  scene.add(allnpc);
  // カメラの作成
  //一人称視点の有力な情報を取得
  //https://qiita.com/cranpun/items/bbb3f35cd21b03f9d290
  const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth/window.innerHeight, 0.1, 1000);
  //普段はこれ↓
  camera.position.set(me.position.x, me.position.y+10, me.position.z-20);
  //確認したいときはこれ↓
  //camera.position.set(0, 10, -20);
  const camera2 = new THREE.PerspectiveCamera(
    50, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera2.position.set(0,0,0);
  camera2.lookAt(0,0,5);
  const helper = new THREE.CameraHelper( camera2 );
  scene.add( helper );
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
const allYataiGroup = new THREE.Group();
const FishYatai1 = makeFishYatai();
FishYatai1.position.set(-35, 0, -30);
FishYatai1.rotation.y = Math.PI / 2;
allYataiGroup.add(FishYatai1);
const FoodYatai1 = makeFoodYatai();
FoodYatai1.position.set(-35, 0, 0);
FoodYatai1.rotation.y = Math.PI / 2;
allYataiGroup.add(FoodYatai1);
const GunYatai1 = makeGunYatai();
GunYatai1.position.set(-35, 0, 30);
GunYatai1.rotation.y = Math.PI/2;
allYataiGroup.add(GunYatai1);

const FishYatai2 = makeFishYatai();
FishYatai2.position.set(35, 0, 30);
FishYatai2.rotation.y = -Math.PI / 2;
allYataiGroup.add(FishYatai2);
const FoodYatai2 = makeFoodYatai();
FoodYatai2.position.set(35, 0, -30);
FoodYatai2.rotation.y = -Math.PI / 2;
allYataiGroup.add(FoodYatai2);
const GunYatai2 = makeGunYatai();
GunYatai2.position.set(35, 0, 0);
GunYatai2.rotation.y = -Math.PI / 2;
allYataiGroup.add(GunYatai2);

//allYataiGroup.scale.set(1.5, 1.5, 1.5);
allYataiGroup.children.forEach((child) =>{
  child.castShadow = true;
  child.receiveShadow = true;
});
const yataiBoundingBoxes = allYataiGroup.children.map(child => {
  const box = new THREE.Box3().setFromObject(child);////変更点
  return { box, object: child };
});
scene.add(allYataiGroup);

//高台
const allTakadaiGroup = new THREE.Group();
const Takadai0 = makeTakadai();
Takadai0.position.set(0,0,100);
allTakadaiGroup.add(Takadai0);
const Takadai1 = makeTakadai();
Takadai1.position.set(120,-20,120);
allTakadaiGroup.add(Takadai1);
const Takadai2 = makeTakadai();
Takadai2.position.set(-120,-20,120);
allTakadaiGroup.add(Takadai2);
const Takadai3 = makeTakadai();
Takadai3.position.set(120,-20,-120);
allTakadaiGroup.add(Takadai3);
const Takadai4 = makeTakadai();
Takadai4.position.set(-120,-20,-120);
allTakadaiGroup.add(Takadai4);
allYataiGroup.children.forEach((child) =>{
  child.castShadow = true;
  child.receiveShadow = true;
});
const takadaiBoundingBoxes = allTakadaiGroup.children.map(child => {
  const box = new THREE.Box3().setFromObject(child);////変更点
  return { box, object: child };
});
scene.add(allTakadaiGroup);

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
  plane.receiveShadow = true; 
  scene.add(plane);
  /////////////////////////////npc1のコースの設定
  // 制御点
  const controlPoints1 = [
    [-15, 0, 60],
    [-15, 0, -60],
    [-55, 0, -60],
    [-55, 0, 60],
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
    [15, 0, -60],
    [15, 0, 60],
    [55, 0, 60],
    [55, 0, -60]
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
  /////////////////////////////npc3のコースの設定//////////時間があったら逆回転にする
  // 制御点
  const controlPoints3 = [
    [20, 0, 80],
    [20, 0, 120],
    [-20, 0, 120],
    [-20, 0, 80]
  ]
  const p4 = new THREE.Vector3();
  const p5 = new THREE.Vector3();
  const course3 = new THREE.CatmullRomCurve3(
    controlPoints3.map((p, i) => {
      p4.set(...p);
      p5.set(...controlPoints3[(i + 1) % controlPoints3.length]);
      return [
        (new THREE.Vector3()).copy(p4),
        (new THREE.Vector3()).lerpVectors(p4, p5, 1/3),
        (new THREE.Vector3()).lerpVectors(p4, p5, 2/3),
      ];
    }).flat(), true
  )
  
///////////////////npcend

  // 電線
  const densen = makeDensen();
  densen.position.y = 5;
  scene.add(densen);

  // コースの描画
  const points1 = course1.getPoints(300);
  const points2 = course2.getPoints(300);
  const points3 = course3.getPoints(300);
  const courseObject1 = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points1),
    new THREE.LineBasicMaterial({ color: "red"})
  );
  const courseObject2 = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points2),
    new THREE.LineBasicMaterial({ color: "blue"})
  );
  const courseObject3 = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points3),
    new THREE.LineBasicMaterial({ color: "green"})
  );
  
  scene.add(courseObject1);
  scene.add(courseObject2);
  scene.add(courseObject3);
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
  const npcPosition3 = new THREE.Vector3();
  const npcTarget3 = new THREE.Vector3();

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
  // ロボットのアニメーションを更新
  animateCBRobot(npc1, clock);
  animateCBRobot(npc2, clock);
  animateCBRobot(npc9, clock);
  
  const speed = 0.5; // 移動速度を調整
  const previousPosition = me.position.clone(); // 移動前の位置を保存

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

  let isMoving = false; // ロボットの移動状態
  // 現在の位置と前の位置を比較
  const currentPosition = me.position;
  isMoving = !currentPosition.equals(previousPosition);

  // ロボットが進んでいる場合にアニメーションを実行
  if (isMoving) {
      animateMyRobot(me, clock);
  }

  // 前の位置を更新
  previousPosition.copy(currentPosition);
  // アバターの境界ボックスを更新
  meBoundingBox.setFromObject(me);

  // 衝突判定
  const collision1 = yataiBoundingBoxes.some(({ box }) => meBoundingBox.intersectsBox(box));
  const collision2 = takadaiBoundingBoxes.some(({ box }) => meBoundingBox.intersectsBox(box));
  const collision3 = npcBoundingBoxes.some(({ box }) => meBoundingBox.intersectsBox(box));

  // 衝突や移動範囲外の場合の処理
  if (collision1 || collision2 || collision3 || me.position.z >= 150 || me.position.z <= -150 || me.position.x <= -150 || me.position.x >= 150) {
    //me.position.copy(previousPosition); // 元の位置に戻す
    if (me.position.z <= -150 || me.position.z >= 150 || me.position.x <= -150 || me.position.x >= 150) {
      document.getElementById("output").innerText = "地面から落ちてしまった！";
      //console.log('me.position.z:', me.position.z);
      me.position.copy(previousPosition);
    } else if (collision1) {
      document.getElementById("output").innerText = "いらっしゃい！（あなたは屋台の魅力に惹かれて動けなくなった）";
    } else if (collision2) {
      document.getElementById("output").innerText = "高台なんかに何か用かい？(あなたは高台の高さに魅力を感じて動けなくなった)";
    } else if (collision3){
      document.getElementById("output").innerText = "「痛っ！？」(あなたは他人とぶつかって動けなくなった)";
    }
  }
}


// 回転を更新する関数
let direction;
function updateRotation() {
  direction = new THREE.Vector3();
    // キー入力に応じた方向設定
    if (keyState.up) direction.z += 1; // 前
    if (keyState.down) direction.z -= 1; // 後ろ
    if (keyState.left) direction.x += 1; // 左
    if (keyState.right) direction.x -= 1; // 右

    if (direction.length() > 0) {
      direction.normalize(); // 方向ベクトルを正規化
      const angle = Math.atan2(direction.x, direction.z); // 回転角を計算
      me.rotation.y = angle; // Y軸を中心に回転
      camera2.position.set(me.position.x, me.position.y+5, me.position.z);
      const camera2LA = new THREE.Vector3();
      camera2LA.addVectors(direction, camera2.position);
      camera2.lookAt(camera2LA);
    }
}



  // 描画関数
  function render() {///////////////////////////////////render
    moveMe(); // キー入力に応じてアバターを移動
    updateRotation(); // アバターの向きを更新
    // npc の位置と向きの設定
    const elapsedTime = clock.getElapsedTime() / 30;
    course1.getPointAt(elapsedTime % 1, npcPosition1);
    course2.getPointAt(elapsedTime % 1, npcPosition2);
    course3.getPointAt(elapsedTime % 1, npcPosition3);
    npc1.position.copy(npcPosition1);
    npc2.position.copy(npcPosition2);
    npc9.position.copy(npcPosition3);
    course1.getPointAt((elapsedTime+0.01) % 1, npcTarget1);
    course2.getPointAt((elapsedTime+0.01) % 1, npcTarget2);
    course3.getPointAt((elapsedTime+0.01) % 1, npcTarget3);
    npc1.lookAt(npcTarget1);
    npc2.lookAt(npcTarget2);
    npc9.lookAt(npcTarget3);
    // 背景の切り替え
    if(param.background) {
      scene.background = renderTarget.texture;
      plane.visible = false;
    }
    else{
      scene.background = null;
      plane.visible = true;
    }
    // 影についての設定
    renderer.shadowMap.enabled = true;
    // Render関数内
    orbitControls.enabled = param.freeView;
    orbitControls.update();
    // コース表示の有無
    courseObject1.visible = param.course1;
    courseObject2.visible = param.course2;
    courseObject3.visible = param.course3;
    // 座標表示の有無
    axes.visible = param.axes;
    helper.update();
 
    if (param.tuiseki) {
      renderer.render(scene, camera2);
    }else if(param.birdsEye){
      camera.position.set(0,300,0);//上空から
      camera.lookAt(plane.position);//平面の中央を見る
      camera.up.set(0,0,1);
      renderer.render(scene, camera);
    }
    else {
    // 描画
      camera.up.set(0,1,0);
      renderer.render(scene, camera);
    }
    scene.children.forEach(child => {
      if (child instanceof THREE.CameraHelper) {
        scene.remove(child);
      }
    });
    // 次のフレームでの描画要請
    requestAnimationFrame(render);
  }
}

init();