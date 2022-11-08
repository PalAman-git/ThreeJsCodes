import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { Float32BufferAttribute } from "three";

/**
 * Textures
 */
//Door
const textureLoad = new THREE.TextureLoader();
const doorColorTexture = textureLoad.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoad.load("/textures/door/alpha.jpg");
const doorHeightTexture = textureLoad.load("/textures/door/height.jpg");
const doorAmbientOcclusionTexture = textureLoad.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorMetalnessTexture = textureLoad.load("/textures/door/metalness.jpg");
const doorNormalTexture = textureLoad.load("/textures/door/normal.jpg");
const doorRoughnessTexture = textureLoad.load("/textures/door/roughness.jpg");

//walls
const wallColorTexture = textureLoad.load("/textures/bricks/color.jpg");
const wallAmbientOcclusionTexture = textureLoad.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const wallNormalTexture = textureLoad.load("/textures/bricks/normal.jpg");
const wallRoughnessTexture = textureLoad.load("/textures/bricks/roughness.jpg");

//Grass
const grassColorTexture = textureLoad.load("/textures/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoad.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoad.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoad.load("/textures/grass/roughness.jpg");

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

//for texture to repeat in x
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

//for texture to repeat in y
grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 *
 * Base
 *
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//Fog
const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * House
 */

//Group
const house = new THREE.Group();
scene.add(house);
//Walls
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    normalMap: wallNormalTexture,
    aoMap: wallAmbientOcclusionTexture,
    roughnessMap: wallRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 1.25;
house.add(walls);

//Roof
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI / 4;
house.add(roof);

//Door
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    alphaMap: doorAlphaTexture,
    map: doorColorTexture,
    displacementMap: doorHeightTexture,
    aoMap: doorAmbientOcclusionTexture,
    transparent: true,
    displacementScale: 0.1,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.z = 2 + 0.001;
door.position.y = 1;
house.add(door);

//Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 15, 15);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.2, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

//GraveYard Group
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

//making 50 graveyard
for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * 6.7 + 3;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.castShadow=true
  // grave.receiveShadow=true
  grave.position.set(x, 0.3, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  scene.add(grave);
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    normalMap: grassNormalTexture,
    roughness: grassRoughnessTexture,
    aoMap: grassAmbientOcclusionTexture,
  })
);
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#ffffff", 0.12);
moonLight.position.set(4, 5, -2);
// gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
// gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
// gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
// gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
// scene.add(moonLight)

//Door Light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
scene.add(ghost1);

const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
scene.add(ghost2);

const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
scene.add(ghost3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//to clear the black background and have the same color as fog we are doing this
renderer.setClearColor("#262837");

/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap

moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow=true
bush1.castShadow=true
bush2.castShadow=true
bush3.castShadow=true
bush4.castShadow=true

// walls.receiveShadow=true
floor.receiveShadow=true

doorLight.shadow.mapSize.width=256
doorLight.shadow.mapSize.height=256
doorLight.shadow.camera.far=7

ghost1.shadow.mapSize.width=256
ghost1.shadow.mapSize.height=256
ghost1.shadow.camera.far=7

ghost2.shadow.mapSize.width=256
ghost2.shadow.mapSize.height=256
ghost2.shadow.camera.far=7

ghost3.shadow.mapSize.width=256
ghost3.shadow.mapSize.height=256
ghost3.shadow.camera.far=7



/**
 * Animate
 */
const clock = new THREE.Clock();
const ghostRadius = Math.random() * 5 + 3;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const ghost1Radius = Math.random() * 6 + 3;
  const ghost2Radius = Math.random() * 6 + 3;
  const ghost3Radius = Math.random() * 6 + 3;
  //ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 3.7;
  ghost1.position.z = Math.sin(ghost1Angle) * 3.7;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 6;
  ghost2.position.z = Math.sin(ghost2Angle) * 6;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = elapsedTime * 0.2;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime + 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime + 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
