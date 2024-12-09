"use strict";
// https://www.youtube.com/watch?v=Q_I0Tq61Ud8
//サンプルコード
import * as THREE from "three";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls"
//前進か後進か変数宣言
let moveFoward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

//移動速度と移動方向の定義
const velocity = new THREE.Vector3D();//速度
const direction = new THREE.Vector3D();//方向
const color = new THREE.Color();

// シーンカメラレンダラーライトなどなど

//FPS視点設定//マウスで視点移動
const controls = new PointerLockControls(camera, render.domElement);
window.addEventListener("click", () =>{
  controls.lock();
})

//オブジェクト

//キーボード操作
const onKeyDown = (e) => {
  switch(e.code){
    case "KeyW": 
      moveFoward = true;
      break;
    case "KeyA": 
      moveLeft = true;
      break;
    case "KeyS": 
      moveBackward = true;
      break;
    case "KeyD": 
      moveRight = true;
      break;
  }
};
const onKeyUp = (e) => {
  switch(e.code){
    case "KeyW": 
      moveFoward = false;
      break;
    case "KeyA": 
      moveLeft = false;
      break;
    case "KeyS": 
      moveBackward = false;
      break;
    case "KeyD": 
      moveRight = false;
      break;
  }
};
document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);


let prevTime = performance.now();//ここから
function animate() {
  requestAnimationFrame(animate);

  let prevTime = performance.now();//ここまででフレームレーとがわかる
  // 前進後進判定
  direction.z = Number(moveFoward) - Number(moveBackward);//1-0=1,0-1=-1
  direction.x = Number(moveRight) - Numver(moveLeft);

  //ポインターがONになったら
  if(controls.isLocked){
    const delta = (time - prevTime)/1000;//これでどのpcでも同じ操作ができる
    //減衰
    velocity.z -= velocity.z * 5.0 * delta;
    velocity.x -= velocity.x * 5.0 * delta;
    if(moveFoward || moveBackward){
      velocity.z -= direction.z*200*delta;// 1or-1
    }
    if(moveRight || moveLeft){
      velocity.x -= direction.x*200*delta;// 1or-1
    }

    controls.moveFoward(-velocity.z * delta);// sokudotyousei
    controls.moveFoward(-velocity.x * delta);
  }

  renderer.render(scene, camera);
}

animate();

/**
 * 画面リサイズ設定
 **/
window.addEventListener("resize", onWindowResize);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}