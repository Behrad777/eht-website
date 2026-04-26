import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import motiqGlbUrl from '../assets/models/motiq-entire.glb?url';
import ehtGlbUrl from '../assets/models/eht.glb?url';

function makeDraco() {
  const draco = new DRACOLoader();
  draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
  return draco;
}

function tuneModel(root, targetSize = 1.2) {
  root.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = false;
      o.receiveShadow = false;
      o.frustumCulled = false;
      if (o.material) {
        o.material.envMapIntensity = 0.85;
        if (o.material.roughness !== undefined) {
          o.material.roughness = Math.max(0.35, o.material.roughness);
        }
      }
    }
  });

  const bbox = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  bbox.getSize(size);
  const center = new THREE.Vector3();
  bbox.getCenter(center);

  const pivot = new THREE.Group();
  root.position.sub(center);
  pivot.add(root);

  const maxDim = Math.max(size.x, size.y, size.z);
  const k = targetSize / maxDim;
  pivot.scale.setScalar(k);

  const pivotBbox = new THREE.Box3().setFromObject(pivot);
  const pivotSize = new THREE.Vector3();
  pivotBbox.getSize(pivotSize);

  return { pivot, bbox: pivotBbox, size: pivotSize };
}

async function loadGlb(url, { onProgress } = {}) {
  const loader = new GLTFLoader();
  const draco = makeDraco();
  loader.setDRACOLoader(draco);

  const gltf = await new Promise((resolve, reject) => {
    loader.load(
      url,
      resolve,
      (ev) => { if (ev.total && onProgress) onProgress(ev.loaded / ev.total); },
      reject,
    );
  });

  return { gltf, root: gltf.scene, draco };
}

export async function loadMotiq({ onProgress } = {}) {
  const { gltf, root, draco } = await loadGlb(motiqGlbUrl, { onProgress });
  const { pivot, bbox, size } = tuneModel(root, 1.2);
  pivot.name = 'motiq-pivot';
  return { gltf, root, pivot, bbox, size, draco };
}

export async function loadEht({ onProgress } = {}) {
  const { gltf, root, draco } = await loadGlb(ehtGlbUrl, { onProgress });
  const { pivot, bbox, size } = tuneModel(root, 1.0);
  pivot.name = 'eht-pivot';
  return { gltf, root, pivot, bbox, size, draco };
}
