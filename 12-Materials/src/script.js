import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DoubleSide, PointLight } from "three";

/**
 * Textures
 */

const textureloader=new THREE.TextureLoader();
const cubeTextureLoader=new THREE.CubeTextureLoader()

const doorAlphaTexture=textureloader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture=textureloader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture=textureloader.load('/textures/door/height.jpg');
const doorNormalTexture=textureloader.load('/textures/door/normal.jpg');
const doorMetalnessTexture=textureloader.load('/textures/door/metalness.jpg');
const doorRoughtnessTexture=textureloader.load('/textures/door/roughness.jpg');
const doorColorTexture=textureloader.load('/textures/door/color.jpg');


const lavaColorTexture=textureloader.load('/textures/Lava/Lava_001_COLOR.png');
const lavaNormalTexture=textureloader.load('/textures/Lava/Lava_001_NRM.png');
const lavaHeightTexture=textureloader.load('/textures/Lava/Lava_001_DISP.png');
const lavaAmbientOcclusionTexture=textureloader.load('/textures/Lava/Lava_001_OCC.png');
const lavaReflectionTexture=textureloader.load('/textures/Lava/Lava_001_SPEC.png');


const rockColorTexture=textureloader.load('/textures/Rock/Dried_Soil_001_COLOR.jpg');
const rockNormalTexture=textureloader.load('/textures/Rock/Dried_Soil_001_NRM.jpg');
const rockHeightTexture=textureloader.load('/textures/Rock/Dried_Soil_001_DISP.png');
const rockAmbientOcclusionTexture=textureloader.load('/textures/Rock/Dried_Soil_001_OCC.jpg');
const rockReflectionTexture=textureloader.load('/textures/Rock/Dried_Soil_001_SPEC.jpg');


const matcapTexture=textureloader.load('/textures/matcaps/8.png');
const gradient=textureloader.load('/textures/gradients/3.jpg');

//we have to provide it array images in order just below
const environmentMapTexture=cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg',
])

// gradient.minFilter=THREE.NearestFilter;
// gradient.magFilter=THREE.NearestFilter;
// gradient.generateMipmaps=false;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
// const material = new THREE.MeshBasicMaterial();
// material.side=DoubleSide;

// const material=new THREE.MeshNormalMaterial(); 
// material.flatShading=true;

// const material=new THREE.MeshMatcapMaterial();
// material.matcap=matcapTexture;

// const material=new THREE.MeshLambertMaterial();

// const material=new THREE.MeshPhongMaterial();

// const material=new THREE.MeshToonMaterial();

const material=new THREE.MeshStandardMaterial();
material.map=lavaColorTexture;
// material.gradientMap=gradient;
material.displacementMap=lavaHeightTexture
material.displacementScale=0.15
// material.metalnessMap=doorMetalnessTexture
// material.roughnessMap=doorRoughtnessTexture
material.normalMap=lavaNormalTexture
material.aoMap=lavaAmbientOcclusionTexture
// material.alphaMap=doorAlphaTexture
// material.transparent=true;

//we are going to load environment texture loader
//environment map is cube texture it is not a simple one 
//to load cube texture we must use the CubeTextureLoader instead of the TextureLoader

// const material=new THREE.MeshStandardMaterial()
// material.metalness=0.7
// material.roughness=0;
// material.envMap=environmentMapTexture


/**
 * Lights
 */
const ambientLight=new THREE.AmbientLight('white',0.2);
const pointLight=new THREE.PointLight('white');
pointLight.position.set(2,3,4);
scene.add(pointLight);
scene.add(ambientLight);



const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.25, 64, 64), material);
sphere.position.x = -1.5;
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1,100,100), material);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //update objects
  // sphere.rotation.y = 0.1 * elapsedTime;
  // plane.rotation.y = 0.1 * elapsedTime;
  // torus.rotation.y = 0.1 * elapsedTime;

  // sphere.rotation.x = 0.15 * elapsedTime;
  // plane.rotation.x = 0.15 * elapsedTime;
  // torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
