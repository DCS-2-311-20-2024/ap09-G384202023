//
// G384202023 大野彩花
//
"use strict"; // 厳格モード

import * as THREE from "three";

export function makeDensen() {
    // 段ボールロボットの設定
    const group = new THREE.Group();

    function densenMtoR(){
        const group = new THREE.Group();
        const densenMtoR = [
        // [-10, 40 * 1.5 - 5 - 5, 90],
        // [-30, 40 * 1.5 - 5 - 15, 95],
        // [-70, 40 * 1.5 - 5 - 20, 105],
        // [-110, 40 * 1.5 - 5 - 18, 110]
        [0, 40 * 1.5 - 5 - 5, 0],
        [-20, 40 * 1.5 - 5 - 15, 5],
        [-60, 40 * 1.5 - 5 - 20, 15],
        [-100, 40 * 1.5 - 5 - 18, 20]
        ];
        const courseMR = new THREE.CatmullRomCurve3(
        densenMtoR.map(p => new THREE.Vector3(...p)),
        false
        );
        const pointsMR = courseMR.getPoints(300);
        const courseObjectMR = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pointsMR),
        new THREE.LineBasicMaterial({ color: "silver" })
        );
        group.add(courseObjectMR);
        const arrowInterval = 50; // 矢印の間隔（ポイント数で指定）
        for (let i = 0; i < pointsMR.length - arrowInterval; i += arrowInterval) {
        const start = pointsMR[i];
        const end = pointsMR[i + arrowInterval];
        const direction = new THREE.Vector3().subVectors(end, start).normalize(); // 矢印の方向
        const arrow = new THREE.ArrowHelper(direction, start, direction.length(), "green"); // 矢印の色
        group.add(arrow);
        }
        return group;
    }

    const MR = densenMtoR();
    MR.position.set(-10, 0, 90);
    const ML = densenMtoR();
    ML.rotation.y = Math.PI/1.15;
    ML.position.set(10, 0, 90);
    const MFR = densenMtoR();
    MFR.rotation.y = -Math.PI/2.63;
    MFR.position.set(-10, 0, 90);
    MFR.scale.set(2.2, 1, 1);
    const MFL = densenMtoR();
    MFL.rotation.y = -Math.PI/2.63-Math.PI/3.4;
    MFL.position.set(10, 0, 90);
    MFL.scale.set(2.2, 1, 1);
    group.add(MR);
    group.add(ML);
    group.add(MFR);
    group.add(MFL);
    // const MLR = densenMtoR();
    // group.add(MLR);
    // const MLL = densenMtoR();
    // group.add(MLL);
    // 影についての設定
    group.children.forEach((child) =>{
      child.castShadow = true;
      child.receiveShadow = true;
    });
  
    // 再生結果を戻す
    return group;
}
