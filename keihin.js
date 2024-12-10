//
// G384202023 大野彩花
//
"use strict"; // 厳格モード
import { makeCBRobot } from './myavatar.js';
import { makeme } from './makeme.js';
import { makeFishYatai, makeFoodYatai, makeGunYatai,  makeTakadai} from './building.js';
import * as THREE from "three";

export function setKeihin(){
    const group = new THREE.Group();

    // 中段
    const metoy1 = makeme();
    metoy1.position.set(-4,6,-5);
    metoy1.scale.set(0.2,0.2,0.2);
    group.add(metoy1);
    const metoy2 = makeme();
    metoy2.position.set(4,6,-5);
    metoy2.scale.set(0.2,0.2,0.2);
    group.add(metoy2);
    const npctoy1 = makeCBRobot();
    npctoy1.position.set(4,6,-5);
    npctoy1.scale.set(0.2,0.2,0.2);
    group.add(npctoy1);

    // 上段
    const npctoy2 = makeCBRobot();
    npctoy2.position.set(-4,9,-5);
    npctoy2.scale.set(0.1,0.1,0.1);
    group.add(npctoy2);
    const npctoy3 = makeCBRobot();
    npctoy3.position.set(-2,9,-5);
    npctoy3.scale.set(0.1,0.1,0.1);
    group.add(npctoy3);
    const npctoy4 = makeCBRobot();
    npctoy4.position.set( 0,9,-5);
    npctoy4.scale.set(0.1,0.1,0.1);
    group.add(npctoy4);
    const npctoy5 = makeCBRobot();
    npctoy5.position.set( 2,9,-5);
    npctoy5.scale.set(0.1,0.1,0.1);
    group.add(npctoy5);
    const npctoy6 = makeCBRobot();
    npctoy6.position.set( 4,9,-5);
    npctoy6.scale.set(0.1,0.1,0.1);
    group.add(npctoy6);

    // 下段
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-4,3.5,-5);
    group.add(sphere);

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0,3.5,-5)
    group.add(cube);
    
    const coneGeometry = new THREE.ConeGeometry(0.5, 1, 4);
    const coneMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.set(4,3.5,-5);
    group.add(cone);


    // 落下したやつ
    const npctoyz = makeCBRobot();
    npctoyz.position.set(4,0.2,-5);
    npctoyz.rotation.set(-Math.PI/2,Math.PI/4,Math.PI/8);
    npctoyz.scale.set(0.2,0.2,0.2);
    group.add(npctoyz);



    
    return group;
}