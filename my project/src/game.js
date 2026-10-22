/* global THREE */
(() => {
  'use strict';

  const ISLAND_SIZE = 12;
  const WORLD_HEIGHT = 4;
  const BLOCK_SIZE = 1;
  const game = document.querySelector('#game');
  const overlay = document.querySelector('#overlay');
  const startButton = document.querySelector('#start');
  const crosshair = document.querySelector('#crosshair');
  const hint = document.querySelector('#hint');

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#bfe0f4');
  scene.fog = new THREE.Fog('#bfe0f4', 24, 62);

  const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 100);
  camera.rotation.order = 'YXZ';
  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(game.clientWidth, game.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  game.prepend(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x718566, 2.1));
  const sunlight = new THREE.DirectionalLight(0xfff2d4, 2.5);
  sunlight.position.set(-8, 18, 10);
  scene.add(sunlight);

  const loader = new THREE.TextureLoader();
  const texture = (name) => {
    const image = loader.load(`assets/textures/16px/${name}.png`);
    image.colorSpace = THREE.SRGBColorSpace;
    image.magFilter = THREE.NearestFilter;
    image.minFilter = THREE.NearestFilter;
    return image;
  };
  const materials = {
    grassTop: new THREE.MeshLambertMaterial({ map: texture('grass_top') }),
    grassSide: new THREE.MeshLambertMaterial({ map: texture('grass_side') }),
    dirt: new THREE.MeshLambertMaterial({ map: texture('dirt') }),
    stone: new THREE.MeshLambertMaterial({ map: texture('stone') }),
  };
  const blockGeometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  const island = new THREE.Group();
  const half = ISLAND_SIZE / 2;
  for (let y = 0; y > -WORLD_HEIGHT; y -= 1) {
    for (let x = 0; x < ISLAND_SIZE; x += 1) {
      for (let z = 0; z < ISLAND_SIZE; z += 1) {
        const sides = y === 0 ? materials.grassSide : (y > -3 ? materials.dirt : materials.stone);
        const faces = y === 0
          ? [sides, sides, materials.grassTop, materials.dirt, sides, sides]
          : sides;
        const block = new THREE.Mesh(blockGeometry, faces);
        block.position.set(x - half + 0.5, y - 0.5, z - half + 0.5);
        island.add(block);
      }
    }
  }
  island.position.y = 0;
  scene.add(island);

  // A small decorative underside makes the finite floating island readable from below.
  const underside = new THREE.Mesh(
    new THREE.ConeGeometry(4.5, 5, 8),
    materials.stone,
  );
  underside.position.set(0, -5.4, 0);
  underside.rotation.y = Math.PI / 8;
  scene.add(underside);

  class PointerLockControls {
    constructor(target) {
      this.target = target;
      this.isLocked = false;
      this.onChange = () => {};
      document.addEventListener('pointerlockchange', () => {
        this.isLocked = document.pointerLockElement === this.target;
        this.onChange(this.isLocked);
      });
      document.addEventListener('mousemove', (event) => {
        if (!this.isLocked) return;
        camera.rotation.y -= event.movementX * 0.0022;
        camera.rotation.x -= event.movementY * 0.0022;
        camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x, -Math.PI / 2.1, Math.PI / 2.1);
      });
    }
    lock() { this.target.requestPointerLock(); }
  }
  const controls = new PointerLockControls(renderer.domElement);
  controls.onChange = (locked) => {
    overlay.classList.toggle('hidden', locked);
    crosshair.classList.toggle('visible', locked);
    hint.textContent = locked ? 'W A S D 移動　·　空白鍵跳躍' : '點擊畫面開始';
  };
  startButton.addEventListener('click', () => controls.lock());
  renderer.domElement.addEventListener('click', () => {
    if (!controls.isLocked) controls.lock();
  });

  const keys = new Set();
  let verticalVelocity = 0;
  let onGround = true;
  const player = new THREE.Vector3(0, 1.65, 5.2);
  const direction = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const clock = new THREE.Clock();
  camera.position.copy(player);

  // Jump only when standing on the island, so the player cannot fly by holding space.
  document.addEventListener('keydown', (event) => {
    keys.add(event.code);
    if (event.code === 'Space') event.preventDefault();
    if (event.code === 'Space' && onGround && controls.isLocked) {
      verticalVelocity = 7.2;
      onGround = false;
    }
  });
  document.addEventListener('keyup', (event) => keys.delete(event.code));
  document.addEventListener('pointerlockchange', () => {
    if (!controls.isLocked) keys.clear();
  });

  function resize() {
    const width = game.clientWidth;
    const height = game.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', resize);

  function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.04);
    if (controls.isLocked) {
      direction.set(0, 0, 0);
      forward.set(-Math.sin(camera.rotation.y), 0, -Math.cos(camera.rotation.y));
      right.set(Math.cos(camera.rotation.y), 0, -Math.sin(camera.rotation.y));
      if (keys.has('KeyW')) direction.add(forward);
      if (keys.has('KeyS')) direction.sub(forward);
      if (keys.has('KeyD')) direction.add(right);
      if (keys.has('KeyA')) direction.sub(right);
      if (direction.lengthSq()) {
        direction.normalize().multiplyScalar(5 * delta);
        player.x += direction.x;
        player.z += direction.z;
      }

      verticalVelocity -= 18 * delta;
      player.y += verticalVelocity * delta;
      if (player.y <= 1.65 && player.x > -half && player.x < half && player.z > -half && player.z < half) {
        player.y = 1.65;
        verticalVelocity = 0;
        onGround = true;
      }
      if (player.y < -14) {
        player.set(0, 1.65, 5.2);
        verticalVelocity = 0;
        onGround = true;
      }
      camera.position.copy(player);
    }
    renderer.render(scene, camera);
  }
  animate();
})();
