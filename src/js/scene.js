import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export function createScene(canvas) {
  // renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = false;

  // scene
  const scene = new THREE.Scene();
  scene.background = null;

  // environment (neutral, slightly warm) — drives PBR material shading
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;

  // camera
  const camera = new THREE.PerspectiveCamera(
    32,
    window.innerWidth / window.innerHeight,
    0.05,
    100
  );
  camera.position.set(0, 0.25, 3.2);

  // lights — restrained, modelled on a studio setup
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-2.4, 3.1, 2.6);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xe8ecf2, 0.7);
  fill.position.set(2.8, 0.6, 1.4);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xffe9d6, 0.9);
  rim.position.set(0.4, -1.0, -2.4);
  scene.add(rim);

  const hemi = new THREE.HemisphereLight(0xfafafa, 0xc9c9c5, 0.45);
  scene.add(hemi);

  // subtle area light for the hero panel fill
  const rectArea = new THREE.RectAreaLight(0xffffff, 2.2, 3.5, 3.5);
  rectArea.position.set(-1.2, 2.0, 2.0);
  rectArea.lookAt(0, 0, 0);
  scene.add(rectArea);

  // resize
  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  window.addEventListener('resize', onResize);

  return { renderer, scene, camera, pmrem, dispose() { pmrem.dispose(); envTexture.dispose(); window.removeEventListener('resize', onResize); } };
}
