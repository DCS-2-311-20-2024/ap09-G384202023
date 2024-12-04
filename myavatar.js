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
export function makeYatai() {
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
