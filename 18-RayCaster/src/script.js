import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { Raycaster } from "three";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;
scene.add(object1);

const object2 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object2.position.x = 0;
scene.add(object2);

const object3 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;
scene.add(object3);

/**
 * RayCaster
 */
const rayCaster = new THREE.Raycaster();

// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);
// rayDirection.normalize()
// rayCaster.set(rayOrigin,rayDirection);

//cast a ray
// const intersect=rayCaster.intersectObject(object2);

// const intersects=rayCaster.intersectObjects(object1,object2,object3);

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
 * Mouse
 */
const mouse = new THREE.Vector2();
addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = (-e.clientY / sizes.height) * 2 + 1;
});

addEventListener('click',(e)=>{
  if(currentIntersect){
    console.log('click on a sphere')
  }
})

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
camera.position.z = 3;
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
let currentIntersect = null;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  //Animated Objects
  object1.position.y = Math.sin(elapsedTime * 0.5) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 0.4) * 1.5;

  //cast a ray
  rayCaster.setFromCamera(mouse, camera);

  const objectsToTest = [object1, object2, object3];

  const intersects = rayCaster.intersectObjects(objectsToTest);

  for (const object of objectsToTest) {
    object.material.color.set("red");
  }

  for (const intersect of intersects) {
    intersect.object.material.color.set("cyan");
  }

  if (intersects.length) {
    if(currentIntersect===null){
      console.log('mouse enter');
    }
    currentIntersect = intersects[0];

  } else {
    if(currentIntersect){
      console.log('mouse leave');
    }
    currentIntersect = null;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
