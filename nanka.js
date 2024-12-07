export function makeTakadai() {
    const Takadai = new THREE.Group();
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
    Takadai.add(legRF);
  
    const legRL = new THREE.Mesh(legGeometry2, FeMaterial);
    legRL.position.set(6, legLen2 / 2, -5);
    Takadai.add(legRL);
  
    const legLF = new THREE.Mesh(legGeometry1, FeMaterial);
    legLF.position.set(-6, legLen1 / 2, 5);
    Takadai.add(legLF);
  
    const legLL = new THREE.Mesh(legGeometry2, FeMaterial);
    legLL.position.set(-6, legLen2 / 2, -5);
    Takadai.add(legLL);
    //  台の作成
    const tableGeometry = new THREE.BoxGeometry(tableW, tableLen, tableD);
    const table = new THREE.Mesh(tableGeometry, WoodMaterial);
    table.position.set(0,tableLen/2,4);
    Takadai.add(table);
  
    //  屋根の作成
  
    //真上
    const yaneGeometry = new THREE.BoxGeometry(yaneW, yaneLen, yaneD);
    const yane = new THREE.Mesh(yaneGeometry, WoodMaterial);
    yane.position.set(0,12,0);
    yane.rotation.x = -Math.PI/10;
    Takadai.add(yane);
    //前
    const yaneFGeometry = new THREE.BoxGeometry(yaneW, yaneLen, yaneD/4);
    const yaneF = new THREE.Mesh(yaneFGeometry, WoodMaterial);
    yaneF.position.set(0,12.6,8.3);
    yaneF.rotation.x = -Math.PI/0.62;
    Takadai.add(yaneF);
    //右
    const yaneSGeometry = new THREE.BoxGeometry(yaneW/4, yaneLen, yaneD);
    const yaneR = new THREE.Mesh(yaneSGeometry, WoodMaterial);
    yaneR.position.set(-8,10.1,0.65);
    yaneR.rotation.x = -Math.PI/10;
    yaneR.rotation.z = -Math.PI/2;
    Takadai.add(yaneR);
    //左
    const yaneL = new THREE.Mesh(yaneSGeometry, WoodMaterial);
    yaneL.position.set(8, 10.1, 0.65); // X座標を反転（-8 → 8）
    yaneL.rotation.x = -Math.PI / 10;
    yaneL.rotation.z = Math.PI / 2; // Z軸回転を右と反対方向に調整
    Takadai.add(yaneL);
    //後ろ
    const yaneBGeometry = new THREE.BoxGeometry(yaneW, yaneLen, yaneD/1.8);
    const yaneB = new THREE.Mesh(yaneBGeometry, WoodMaterial);
    yaneB.position.set(0,5.1,-7.6);
    yaneB.rotation.x = -Math.PI/2;
    Takadai.add(yaneB);
    //提灯
    function makeChochin() {
      // 提灯の本体
      const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32, 1);
      const bodyMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xffffb3, // 提灯の色 (金色っぽい)
        emissive: 0x222222, // 少し発光するように
        transparent: true,
        opacity: 1.5 // 半透明
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    
      // 提灯の上下キャップ (黒い部分)
      const capGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
      const capMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    
      const topCap = new THREE.Mesh(capGeometry, capMaterial);
      const bottomCap = topCap.clone();
    
      topCap.position.set(0, 0.75, 0); // 上部キャップの位置
      bottomCap.position.set(0, -0.75, 0); // 下部キャップの位置
    
      // 提灯のグループ化
      const chochin = new THREE.Group();
      chochin.add(body);
      chochin.add(topCap);
      chochin.add(bottomCap);
      chochin.scale.set(2, 2, 2);
  
      const spotLight = new THREE.SpotLight(0xffffff, 100);
      //spotLight.position.set(0, 0, 0);
      spotLight.castShadow = true;
      Takadai.add(spotLight);
      
      return chochin;
    }
    const chochinR = makeChochin();
    chochinR.position.set(-8,9,9);
    Takadai.add(chochinR);
    const chochinL = makeChochin();
    chochinL.position.set(8,9,9);
    Takadai.add(chochinL);
    
  
    // 影についての設定
    Takadai.children.forEach((child) =>{
      child.castShadow = true;
      child.receiveShadow = true;
    });
  
    // 再生結果を戻す
    return Takadai;
  }