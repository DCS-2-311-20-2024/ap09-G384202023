//
// 応用プログラミング (robot)
// G384202023 大野彩花
//
"use strict"; // 厳格モード

import * as THREE from "three"
const seg = 12; // 円や円柱の分割数
const gap = 0.01; // 胸のマークなどを浮かせる高さ

export function makeCBRobot() {
    // 段ボールロボットの設定
    const cardboardRobot = new THREE.Group
    const cardboardMaterial = new THREE.MeshLambertMaterial({ color: 0xccaa77 });
    const blackMaterial = new THREE.MeshBasicMaterial({color: "black"});
    const legW = 0.8; // 脚の幅
    const legD = 0.8; // 脚の奥行
    const legLen = 3; // 脚の長さ
    const legSep = 1.2; // 脚の間隔
    const bodyW = 2.2; // 胴体の幅
    const bodyH = 3; // 胴体の高さ
    const bodyD = 2; // 胴体の奥行
    const armW = 0.8; // 腕の幅
    const armD = 0.8; // 腕の奥行
    const armLen = 3.8; // 腕の長さ
    const headW = 4; // 頭の幅
    const headH = 2.4; // 頭の高さ
    const headD = 2.4; // 頭の奥行
    const eyeRad = 0.2; // 目の半径
    const eyeSep = 1.6; // 目の間隔
    const eyePos = 0.2; // 目の位置(顔の中心基準の高さ)
    const mouthW = 0.6; // 口の幅
    const mouthH = 0.5; // 口の高さ
    const mouthT = 0.2; // 口の頂点の位置(顔の中心基準の高さ)
    //  脚の作成
    const legGeometry
      = new THREE.BoxGeometry(legW, legLen, legD);
  
    const legR = new THREE.Mesh(legGeometry, cardboardMaterial);
    legR.position.set(-legSep/2, legLen/2, 0);
    cardboardRobot.add(legR);
  
    const legL = new THREE.Mesh(legGeometry, cardboardMaterial);
    legL.position.set(legSep/2, legLen/2, 0);
    cardboardRobot.add(legL);
    
  
    //  胴体の作成
    const bodyGeometry
      = new THREE.BoxGeometry(bodyW, bodyH, bodyD);
    const body = new THREE.Mesh(bodyGeometry,cardboardMaterial);
    body.position.y = legLen*1.5;///////////////////////////
  
    body.children.forEach((child) =>{
      child.castShadow = true;
      child.receiveShadow = true;
    });
    
    cardboardRobot.add(body);
  
    //  腕の設定
    const armGeometry
      = new THREE.BoxGeometry(armW, armLen, armD);
    const arm = new THREE.Mesh(armGeometry,cardboardMaterial);
  
    const armL  = new THREE.Mesh(armGeometry,cardboardMaterial);
    armL.position.set(bodyW/1.5,legLen + bodyH - armLen/2,0);
    cardboardRobot.add(armL);
  
    const armR  = new THREE.Mesh(armGeometry,cardboardMaterial);
    armR.position.set(-(bodyW/1.5),legLen + bodyH - armLen/2,0);
    cardboardRobot.add(armR);
  
    //  頭の設定
  
    const head = new THREE.Group;
    const headGeometry = new THREE.BoxGeometry(headW,headH,headD);
    head.add(new THREE.Mesh(headGeometry,cardboardMaterial));
    const circleGeometry = new THREE.CircleGeometry(eyeRad, seg);
    const eyeL = new THREE.Mesh(circleGeometry,blackMaterial);
    eyeL.position.set(-eyeSep/2,eyePos,headD/2+gap);
    head.add(eyeL);
    const eyeR = new THREE.Mesh(circleGeometry,blackMaterial);
    eyeR.position.set(eyeSep/2,eyePos,headD/2+gap);
    head.add(eyeR);
    const triangleGeometry = new THREE.BufferGeometry();
    const triangleVertices = new Float32Array( [
      0,headH-mouthT,headD/2+gap,
      -mouthW/2,headH-(mouthT + mouthH),headD/2+gap,
      mouthW/2,headH-(mouthT + mouthH),headD/2+gap]);
    triangleGeometry.setAttribute('position',
      new THREE.BufferAttribute(triangleVertices,3));
    body.add(new THREE.Mesh(triangleGeometry,blackMaterial));
  
  
    head.children.forEach((child) =>{
      child.castShadow = true;
      child.receiveShadow = true;
    });
  
    head.position.y = legLen*1.3+bodyH;////////////////
    cardboardRobot.add(head);

   
  
  
    // 影についての設定
    cardboardRobot.children.forEach((child) =>{
      child.castShadow = true;
      child.receiveShadow = true;
    });
  
    // 再生結果を戻す
    return cardboardRobot;
}
///////////////////////////////////////////////////////屋台
export function makeYatai() {
  const Yatai = new THREE.Group();
  const FeMaterial = new THREE.MeshPhongMaterial({ color: 0x244344 });//鉄色
  const WoodMaterial = new THREE.MeshPhongMaterial({ color: 0xDEB887 });//木材
  const legW = 0.2; // 脚の幅
  const legD = 0.2; // 脚の奥行
  const legLen1 = 13.6; // 脚の長さ1
  const legLen2 = 10.3; // 脚の長さ2

  const tableW = 11; // テーブルの幅
  const tableD = 3; // テーブルの奥行
  const tableLen = 4; // テーブルの高さ

  const yaneW = 16; // 屋根の幅
  const yaneD = 16; // 屋根の奥行
  const yaneLen = 0.1; // 屋根の長さ


  //  脚の作成
  const legGeometry1 = new THREE.BoxGeometry(legW, legLen1, legD);
  const legGeometry2 = new THREE.BoxGeometry(legW, legLen2, legD);

  const legRF = new THREE.Mesh(legGeometry1, FeMaterial);
  legRF.position.set(6, legLen1 / 2, 5);
  Yatai.add(legRF);

  const legRL = new THREE.Mesh(legGeometry2, FeMaterial);
  legRL.position.set(6, legLen2 / 2, -5);
  Yatai.add(legRL);

  const legLF = new THREE.Mesh(legGeometry1, FeMaterial);
  legLF.position.set(-6, legLen1 / 2, 5);
  Yatai.add(legLF);

  const legLL = new THREE.Mesh(legGeometry2, FeMaterial);
  legLL.position.set(-6, legLen2 / 2, -5);
  Yatai.add(legLL);
  //  台の作成
  const tableGeometry = new THREE.BoxGeometry(tableW, tableLen, tableD);
  const table = new THREE.Mesh(tableGeometry, WoodMaterial);
  table.position.set(0,tableLen/2,4);
  Yatai.add(table);

  //  屋根の作成

  //真上
  const yaneGeometry = new THREE.BoxGeometry(yaneW, yaneLen, yaneD);
  const yane = new THREE.Mesh(yaneGeometry, WoodMaterial);
  yane.position.set(0,12,0);
  yane.rotation.x = -Math.PI/10;
  Yatai.add(yane);
  //前
  const yaneFGeometry = new THREE.BoxGeometry(yaneW, yaneLen, yaneD/4);
  const yaneF = new THREE.Mesh(yaneFGeometry, WoodMaterial);
  yaneF.position.set(0,12.6,8.3);
  yaneF.rotation.x = -Math.PI/0.62;
  Yatai.add(yaneF);
  //右
  const yaneSGeometry = new THREE.BoxGeometry(yaneW/4, yaneLen, yaneD);
  const yaneR = new THREE.Mesh(yaneSGeometry, WoodMaterial);
  yaneR.position.set(-8,10.1,0.65);
  yaneR.rotation.x = -Math.PI/10;
  yaneR.rotation.z = -Math.PI/2;
  Yatai.add(yaneR);
  //左
  const yaneL = new THREE.Mesh(yaneSGeometry, WoodMaterial);
  yaneL.position.set(8, 10.1, 0.65); // X座標を反転（-8 → 8）
  yaneL.rotation.x = -Math.PI / 10;
  yaneL.rotation.z = Math.PI / 2; // Z軸回転を右と反対方向に調整
  Yatai.add(yaneL);
  //後ろ
  const yaneBGeometry = new THREE.BoxGeometry(yaneW, yaneLen, yaneD/1.8);
  const yaneB = new THREE.Mesh(yaneBGeometry, WoodMaterial);
  yaneB.position.set(0,5.1,-7.6);
  yaneB.rotation.x = -Math.PI/2;
  Yatai.add(yaneB);

  // 影についての設定
  Yatai.children.forEach((child) =>{
    child.castShadow = true;
    child.receiveShadow = true;
  });

  // 再生結果を戻す
  return Yatai;
}
export function makeFishYatai(){
  const FishYatai = new THREE.Group();
  const Basic = makeYatai();
  FishYatai.add(Basic);

///////　ここからは追加物（の素材）
const textureLoader = new THREE.TextureLoader();
const photoTexture = textureLoader.load('fish.jpeg');
//https://www.google.com/url?sa=i&url=https%3A%2F%2Fillustcenter.com%2F2021%2F11%2F24%2Frdesign_6204%2F&psig=AOvVaw3wuGW5VpHUs6J7sZV4CPzJ&ust=1733475586877000&source=images&cd=vfe&opi=89978449&ved=0CBcQjhxqFwoTCKj6vPmhkIoDFQAAAAAdAAAAABAE
const photoMaterial = new THREE.MeshBasicMaterial({ map: photoTexture });
const plainMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
const materials = [
  plainMaterial, // right
  plainMaterial, // left
  photoMaterial, // top
  plainMaterial, // bottom
  plainMaterial, // back
  plainMaterial  // front
];
const daimaterial = new THREE.MeshPhongMaterial({ color: 0xDEB887 });
//　add系
const tableGeometry = new THREE.BoxGeometry(11.5, 4.5, 5);
const table = new THREE.Mesh(tableGeometry, materials);
table.position.set(0,2,4);
FishYatai.add(table);
const daiGeometry = new THREE.BoxGeometry(1.25, 0.2, 5);
const dai = new THREE.Mesh(daiGeometry, daimaterial);
dai.position.set(0,4.35,4);
FishYatai.add(dai);

///////小物
function makepinkPoi() {
  const group = new THREE.Group(); // ポイ全体のグループ

  // === フレーム部分 ===
  const frameGeometry = new THREE.TorusGeometry(0.4, 0.05, 16, 100); // 外側の枠 (半径0.4で0.8×0.8相当)
  const frameMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD1DC }); // ピンク
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.rotation.x = Math.PI / 2; // 正面に向ける
  group.add(frame);

  // === 紙の部分 ===
  const paperGeometry = new THREE.CircleGeometry(0.4, 64); // 枠の内側の紙 (半径0.4)
  const paperMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5, // 半透明
  });
  const paper = new THREE.Mesh(paperGeometry, paperMaterial);
  paper.rotation.x = -Math.PI / 2; // 正面に向ける
  paper.position.z = 0.01; // 枠に重ならないよう少し前に出す
  group.add(paper);

  // === ハンドル部分 ===
  const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 36); // 小さい持ち手
  const handleMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD1DC }); // 茶色
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  handle.rotation.z = Math.PI/2; // 持ち手の角度をつける
  handle.rotation.y = Math.PI/4;
  handle.position.set(-0.5, 0, 0.5); // 持ち手の位置を調整
  group.add(handle);

  return group; // 完成したポイを返す
}
function makeskyPoi() {
  const group = new THREE.Group(); // ポイ全体のグループ

  // === フレーム部分 ===
  const frameGeometry = new THREE.TorusGeometry(0.4, 0.05, 16, 100); // 外側の枠 (半径0.4で0.8×0.8相当)
  const frameMaterial = new THREE.MeshBasicMaterial({ color: 0xB8F8FB }); // ピンク
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.rotation.x = Math.PI / 2; // 正面に向ける
  group.add(frame);

  // === 紙の部分 ===
  const paperGeometry = new THREE.CircleGeometry(0.4, 64); // 枠の内側の紙 (半径0.4)
  const paperMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5, // 半透明
  });
  const paper = new THREE.Mesh(paperGeometry, paperMaterial);
  paper.rotation.x = -Math.PI / 2; // 正面に向ける
  paper.position.z = 0.01; // 枠に重ならないよう少し前に出す
  group.add(paper);

  // === ハンドル部分 ===
  const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 36); // 小さい持ち手
  const handleMaterial = new THREE.MeshBasicMaterial({ color: 0xB8F8FB }); // 茶色
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  handle.rotation.z = Math.PI/2; // 持ち手の角度をつける
  handle.rotation.y = Math.PI/4;
  handle.position.set(-0.5, 0, 0.5); // 持ち手の位置を調整
  group.add(handle);

  return group; // 完成したポイを返す
}

// ポイをシーンに追加
const pinkpoi = makepinkPoi();
pinkpoi.position.set(0,4.5,6);
FishYatai.add(pinkpoi);
const skypoi = makeskyPoi();
skypoi.rotation.y = Math.PI/2;
skypoi.position.set(0,4.5,3);
FishYatai.add(skypoi);

  // 影についての設定
  FishYatai.children.forEach((child) =>{
    child.castShadow = true;
    child.receiveShadow = true;
  });

  // 再生結果を戻す
  return FishYatai;

}
/*
export function makeFoodYatai(){
  const FoodYatai = new THREE.Group();
  const Basic = makeYatai();
  FoodYatai.add(Basic);

  // 影についての設定
  FoodYatai.children.forEach((child) =>{
    child.castShadow = true;
    child.receiveShadow = true;
  });

  // 再生結果を戻す
  return FoodYatai;

}
*/ 

/*
export function makeGunYatai(){
  const GunYatai = new THREE.Group();
  const Basic = makeYatai();
  GunYatai.add(Basic);

  // 影についての設定
  GunYatai.children.forEach((child) =>{
    child.castShadow = true;
    child.receiveShadow = true;
  });

  // 再生結果を戻す
  return GunYatai;

}
*/ 
