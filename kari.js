"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { GUI } from "ili-gui";
import { OrbitControls } from "three/addons";
import { makeCBRobot } from './myavatar.js';

// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {
    opacity: 0.5, // 透明度
    background: true, // 背景
    follow: false, // 追跡
    birdsEye: false, // 俯瞰
    course1: false, // npcコース1
    course2: false, // npcコース2
    axes: false, // 座標軸
    freeView: true, // 自由視点
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "opacity", 0.0, 1.0).name("建物の透明度")
    .onChange(() => {
      buildings.children.forEach((building) => {
        building.material.opacity = param.opacity;
      });
    });

  gui.add(param, "background").name("背景");
  gui.add(param, "follow").name("追跡(後で消す)");
  gui.add(param, "birdsEye").name("俯瞰");
  gui.add(param, "course1").name("コース1");
  gui.add(param, "course2").name("コース2");
  gui.add(param, "axes").name("座標軸");
  gui.add(param, "freeView").name("自由視点");

  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);

  // 光源の設定
  const spotLight = new THREE.SpotLight(0xffffff, 2500);
  spotLight.position.set(-10, 30, 10);
  spotLight.castShadow = true;
  scene.add(spotLight);

  // カメラの作成
  const camera = new THREE.PerspectiveCamera(
    50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(10, 5, 20);
  camera.lookAt(0, 0, 0);

  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, innerHeight);
  renderer.setClearColor(0x102040);
  document.getElementById("output").appendChild(renderer.domElement);

  // カメラの制御をOrbitControlsで実装
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  orbitControls.dampingFactor = 0.05;
  orbitControls.screenSpacePanning = true;
  orbitControls.maxPolarAngle = Math.PI;
  orbitControls.zoomSpeed = 0.8;
  orbitControls.rotateSpeed = 0.8;
  orbitControls.enableZoom = true;
  orbitControls.enablePan = true;
  orbitControls.enableRotate = true;

  // キーボード操作の設定
  function setupKeyboardControls(camera, speed = 0.1) {
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'w': // 前に移動
          camera.position.z -= speed;
          break;
        case 's': // 後ろに移動
          camera.position.z += speed;
          break;
        case 'a': // 左に移動
          camera.position.x -= speed;
          break;
        case 'd': // 右に移動
          camera.position.x += speed;
          break;
        case 'q': // 上に移動
          camera.position.y += speed;
          break;
        case 'e': // 下に移動
          camera.position.y -= speed;
          break;
      }
    });
  }

  // キーボード操作をセットアップ
  setupKeyboardControls(camera);

  // meとnpc1,2の追加
  const npc1 = makeCBRobot();
  const npc2 = makeCBRobot();
  const me = makeCBRobot();
  me.position.set(0, -5, 0);
  scene.add(npc1);
  scene.add(npc2);
  scene.add(me);

  // 背景の設定
  let renderTarget;
  function setBackground() {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      "fu-rinenter.jpg",
      () => {
        renderTarget = new THREE.WebGLCubeRenderTarget(texture.image.height);
        renderTarget.fromEquirectangularTexture(renderer, texture);
        scene.background = renderTarget.texture;
        render();
      }
    );
  }
  setBackground();

  // 環境ライト
  {
    const light = new THREE.AmbientLight();
    light.intensity = 2.0;
    scene.add(light);
  }

  // スポットライト
  {
    const light = new THREE.PointLight(0xffffff, 3000);
    light.position.set(0, 40, 0);
    light.lookAt(0, 0, 0);
    scene.add(light);
  }

  // 構造物の作成
  const buildings = new THREE.Group();
  {
    const w = 20;
    const h = 20;
    const d = 20;
    const gap = 30;
    const n = 3;
    for (let c = 0; c < n; c++) {
      for (let r = 0; r < n; r++) {
        const building = new THREE.Mesh(
          new THREE.BoxGeometry(w, h, d),
          new THREE.MeshPhongMaterial({
            color: 0x408080,
            opacity: param.opacity,
            transparent: true
          })
        );
        building.position.set(
          (w + gap) * (c - (n - 1) / 2),
          0,
          (d + gap) * (r - (n - 1) / 2)
        );

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
    new THREE.MeshLambertMaterial({ color: 0x7d582e })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -5;
  scene.add(plane);

  // コースの設定 (略)

  // 描画処理
  const clock = new THREE.Clock();

  function render() {
    const elapsedTime = clock.getElapsedTime() / 30;

    // NPCの動作処理 (略)

    // 背景の切り替え
    if (param.background) {
      scene.background = renderTarget.texture;
      plane.visible = false;
    } else {
      scene.background = null;
      plane.visible = true;
    }

    // カメラの位置の更新
    if (param.follow) {
      // カメラの追跡処理 (略)
    } else if (param.birdsEye) {
      camera.position.set(0, 150, 0);
      camera.lookAt(me.position);
      camera.up.set(0, 0, -1);
    } else {
      camera.position.set(10, -10, 10);
      camera.lookAt(me.position);
      camera.up.set(0, 1, 0);
    }

    orbitControls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();
}

init();
