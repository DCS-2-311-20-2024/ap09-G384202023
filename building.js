//
// G384202023 大野彩花
//
"use strict"; // 厳格モード

import * as THREE from "three";
import { setKeihin } from './keihin.js';
const seg = 12; // 円や円柱の分割数
const gap = 0.01; // 胸のマークなどを浮かせる高さ

//屋台
export function makeYatai() {
  const Yatai = new THREE.Group();
  const FeMaterial = new THREE.MeshPhongMaterial({ color: 0x244344 });//鉄色
  const WoodMaterial = new THREE.MeshPhongMaterial({ color: 0xB22D35 });//垂れ幕
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
/////////////////////////////////////////////たこ焼き
export function makeFoodYatai(){
  const FoodYatai = new THREE.Group();
  const Basic = makeYatai();
  FoodYatai.add(Basic);

  const MacineMaterial = new THREE.MeshBasicMaterial({ color: 0x244344 });
  const plainMaterial = new THREE.MeshBasicMaterial({ color: 0xB22D35 });
  const materials = [
    plainMaterial, // right
    plainMaterial, // left
    MacineMaterial, // top
    plainMaterial, // bottom
    plainMaterial, // back
    plainMaterial  // front
  ];
  const tableGeometry = new THREE.BoxGeometry(11.5, 4.5, 5);
  const table = new THREE.Mesh(tableGeometry, materials);
  table.position.set(0,2,4);
  FoodYatai.add(table);

  // たこ焼き機の作成
  const takoyakiMachineMaterial = new THREE.MeshPhongMaterial({ color: 0x281a14 }); // 黒っぽい色
  const takoyakiMachineGeometry = new THREE.BoxGeometry(11.3, 1, 4.7);
  const takoyakiMachine = new THREE.Mesh(takoyakiMachineGeometry, takoyakiMachineMaterial);
  takoyakiMachine.position.set(0, 4, 4); // テーブルの上に配置
  FoodYatai.add(takoyakiMachine);

  // たこ焼き穴の作成
  const holeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // 穴の色
  const holeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32); // 半径0.3、高さ0.1の円柱
  const holePositions = [];

  // 穴の配置座標を計算 (3行×4列)
  const machineTopY = 4.5 + 0.5; // たこ焼き機の上面より少し上に配置
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 8; col++) {
      const x = -2 + col * 1.3; // 横方向に配置
      const z = 1 - row * 1;  // 縦方向に配置
      holePositions.push([x, machineTopY, z]); // x, y, z
    }
  }

  // 各穴を作成し、たこ焼き機に追加
  holePositions.forEach(([x, y, z]) => {
    const hole = new THREE.Mesh(holeGeometry, holeMaterial);
    hole.position.set(x-2.7, y-4.53, z+1);
    //hole.rotation.x = Math.PI / 2; // 円柱の向きを上に
    takoyakiMachine.add(hole); // たこ焼き機に直接追加
  });

  // 後ろの台の作成
  const daiMaterial = new THREE.MeshPhongMaterial({ color: 0xdeb887 });
  const daiGeometry = new THREE.BoxGeometry(3, 4, 5);
  const dai = new THREE.Mesh(daiGeometry, daiMaterial);
  dai.position.set(-5, 2, -2);
  FoodYatai.add(dai);

  //////////小物///////////////////
  function makeTakoyakiBoat() {
    const group = new THREE.Group();
    //紙作成
    //繋げる
    return group;
  }
  const takoyakiBoat = makeTakoyakiBoat();
  takoyakiBoat.position.y=6;
  FoodYatai.add(takoyakiBoat);


  // 影についての設定
  FoodYatai.children.forEach((child) =>{
    child.castShadow = true;
    child.receiveShadow = true;
  });

  // 再生結果を戻す
  return FoodYatai;

}


export function makeGunYatai(){
  const GunYatai = new THREE.Group();
  const Basic = makeYatai();
  GunYatai.add(Basic);
  //写真のURL
  //https://www.illust-box.jp/sozai/73053/
  //射的の銃
  function makeGun(){
    const group = new THREE.Group();

    const woodMaterial = new THREE.MeshPhongMaterial({ color: 0xb89465 });
    const w1Geometry = new THREE.BoxGeometry(3.5, 2, 1);
    const w1 = new THREE.Mesh(w1Geometry, woodMaterial);
    w1.position.set(-3,0,0);
    group.add(w1);
    const w2Geometry = new THREE.BoxGeometry(7, 2, 1);
    const w2 = new THREE.Mesh(w2Geometry, woodMaterial);
    w2.position.set(-1.2,-0.5,0);
    w2.rotation.z = Math.PI/8;
    group.add(w2);
    const w3Geometry = new THREE.BoxGeometry(5, 1.8, 1);
    const w3 = new THREE.Mesh(w3Geometry, woodMaterial);
    w3.position.set(4,0.4,0);
    group.add(w3);
    const w4Geometry = new THREE.BoxGeometry(0.5, 1.8, 1);
    const w4 = new THREE.Mesh(w4Geometry, woodMaterial);
    w4.position.set(6.5,0.4,0);
    w4.rotation.z = -Math.PI/10;
    group.add(w4);

    const FeMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    const f1Geometry = new THREE.CylinderGeometry(0.4, 0.4,10, 16, 16, false);
    const f1 = new THREE.Mesh(f1Geometry, FeMaterial);
    f1.position.set(6.7,1.5,0);
    f1.rotation.z = Math.PI/2;
    group.add(f1);

    const f2Geometry = new THREE.BoxGeometry(0.5, 0.5, 0.4);
    const f2 = new THREE.Mesh(f2Geometry, FeMaterial);
    f2.position.set(11.2,1.8,0);
    f2.rotation.z = Math.PI/4;
    group.add(f2);

    return group;
  }
  const gun1 = makeGun();
  gun1.rotation.order = "YXZ"; // 回転の順序を変更
  gun1.rotation.y = Math.PI / 2;
  gun1.rotation.x = Math.PI / 2;
  gun1.rotation.z = 0;
  gun1.scale.set(0.4,0.2,0.2);
  gun1.position.set(3,4.2,5);
  GunYatai.add(gun1);

  const gun2 = makeGun();
  gun2.rotation.order = "YXZ"; // 回転の順序を変更
  gun2.rotation.y = Math.PI / 2;
  gun2.rotation.x = Math.PI / 2;
  gun2.rotation.z = 0;
  gun2.scale.set(0.4,0.2,0.2);
  gun2.position.set(0,4.2,5);
  GunYatai.add(gun2);

  const gun3 = makeGun();
  gun3.rotation.order = "YXZ"; // 回転の順序を変更
  gun3.rotation.y = Math.PI / 2;
  gun3.rotation.x = Math.PI / 2;
  gun3.rotation.z = 0;
  gun3.scale.set(0.4,0.2,0.2);
  gun3.position.set(-3,4.2,5);
  GunYatai.add(gun3);

  //コルク
  function makecork(){
    const woodMaterial = new THREE.MeshPhongMaterial({ color: 0xb89465 });
    const c1Geometry = new THREE.CylinderGeometry(1, 1.5,2, 16, 16, false);
    const c1 = new THREE.Mesh(c1Geometry, woodMaterial);
    c1.rotation.y = Math.PI/2;
    c1.scale.set(0.1,0.1,0.1);
    return c1;
  }
  const c1 = makecork();
  c1.position.set(4,4,5);
  GunYatai.add(c1);
  const c2 = makecork();
  c2.position.set(-2.2,4,5);
  GunYatai.add(c2);
  const c3 = makecork();
  c3.position.set(-2,4,4.7);
  GunYatai.add(c3);//////////ここまでは机の上
  const c4 = makecork();
  c4.rotation.x = Math.PI/2;
  c4.position.set(4,0.2,7);
  GunYatai.add(c4);
  const c5 = makecork();
  c5.rotation.x = Math.PI/2;
  c5.position.set(-4,0.2,0);
  GunYatai.add(c5);
  const c6 = makecork();
  c6.rotation.x = Math.PI/2;
  c6.position.set(3,0.2,-3);
  GunYatai.add(c6);
  const c7 = makecork();
  c7.position.set(0,0.2,-4);
  GunYatai.add(c7);
  const c8 = makecork();
  c8.position.set(-2,0.2,-4);
  GunYatai.add(c8);

  //景品棚
  function makeTana(){
    const tana = new THREE.Group();
    const woodMaterial = new THREE.MeshPhongMaterial({ color: 0xb89465 });
    const w1Geometry = new THREE.BoxGeometry(12, 0.3, 2);
    const w1 = new THREE.Mesh(w1Geometry, woodMaterial);
    tana.add(w1);
    return tana;
  }
  const tana1 = makeTana();
  tana1.position.set(0,3,-5);
  GunYatai.add(tana1);
  const tana2 = makeTana();
  tana2.position.set(0,6,-5);
  GunYatai.add(tana2);
  const tana3 = makeTana();
  tana3.position.set(0,9,-5);
  GunYatai.add(tana3);

  //景品
  const keihin = setKeihin();
  GunYatai.add(keihin);


  // 影についての設定
  GunYatai.children.forEach((child) =>{
    child.castShadow = true;
    child.receiveShadow = true;
  });

  // 再生結果を戻す
  return GunYatai;

}

