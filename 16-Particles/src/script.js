import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const colorMap = textureLoader.load("/textures/particles/2.png");
/**
 * Particles
 */
//Geometry
const particleGeometry = new THREE.BufferGeometry();
const count = 50000;

const positionArray = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);
particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// Material
const particleMaterial = new THREE.PointsMaterial({
  size: 0.1,
  // color:'#ff44fa',
  sizeAttenuation: true,
  alphaMap: colorMap,
  transparent: true,

  //the alphaTest is a value between 0 and 1 that enables the WebGL to know when not to render the pixel according to that pixel's transparency

  //By default, the value is 0 meaning that pixel will be rendered anyway
  //use 0.001

  // alphaTest:0.001

  //Depth Testing
  //When drawing , the WebGL tests if what's  being drawn is closer than what's already drawn That is called depth testing and can be deactivated with alphaTest

  // depthTest:false,

  //using this might give you best result but wait this is good if you only have particle but if you have some object with different color in between the particles you will see each particle which is behind the object and this is not correct
  //for this we are using depth write
  //The depth of what's being drawn is stored in what we call a depth buffer
  //Instead of not testing if the particle is closer than what's in this depth buffer, we can tell the WebGL not to write particles in the depth buffer with depthTest

  depthWrite: false,

  //The webgl is currently draws one on top of the other with the blending property , we can tell the webgl to add the color of the pixel to the color of the pixel already drawn
  //change the blending property to THREE.AdditiveBlending

  blending: THREE.AdditiveBlending,
  //additive blending will have impact on the performance

  vertexColors: true,
});

//Points
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

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

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  //update particles
  //this will animate the whole geometry and not one individual particle
  // particles.rotation.y=elapsedTime*0.2;
  // particles.position.y=-elapsedTime*0.08

  //to animate each particle individually
  for(let i=0;i<count;i++){
    const i3=i*3;//this is for to access the xyz of each using i3
    //just like to access the y value of each particle we could do it like this
    const x=particleGeometry.attributes.position.array[i3]
    particleGeometry.attributes.position.array[i3+1]=Math.sin((elapsedTime)
    +x);

    //to access the x position we do this
  }
  particleGeometry.attributes.position.needsUpdate=true;

  //animating the particles like this way is a bad idea because it is very hard for the gpu to render it instead we do shader to animate particles 

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
