import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { BufferAttribute } from "three";

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 360 });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const parameter = {
  count: 100000,
  size: 0.01,
  radius:5,
  branches:3,
  spin:1,
  randomness:0.2,
  randomnessPower:3,
  insideColor:'#ff6030',
  outsideColor:'#1b3984'
};

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
  /**
   * Destroying old galaxy
   */
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  const colorInside=new THREE.Color(parameter.insideColor);
  const colorOutside=new THREE.Color(parameter.outsideColor);



  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameter.count * 3);
  const colors=new Float32Array(parameter.count*3)
  for (let i = 0; i < parameter.count; i++) {
    let i3 = i * 3;

    const radius=Math.random()*parameter.radius;
    const spinAngle=radius*parameter.spin;
    const branchAngle=(i%parameter.branches)/parameter.branches*2*Math.PI;
   
    const randomX=Math.pow(Math.random(),parameter.randomnessPower)*Math.pow(-1,Math.floor(Math.random()));
    const randomY=Math.pow(Math.random(),parameter.randomnessPower)*Math.pow(-1,Math.floor(Math.random()));
    const randomZ=Math.pow(Math.random(),parameter.randomnessPower)*Math.pow(-1,Math.floor(Math.random()));

    positions[i3] = Math.cos(branchAngle+spinAngle)*radius+randomX; //x part of one point
    positions[i3 + 1] = 0+randomY; //y part of one point
    positions[i3 + 2] =Math.sin(branchAngle+spinAngle)*radius+randomZ; //z part of one point

const mixedColor=colorInside.clone()
mixedColor.lerp(colorOutside,radius/parameter.radius)

    colors[i3]=mixedColor.r//R
    colors[i3+1]=mixedColor.g//G
    colors[i3+2]=mixedColor.b//B
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color',new BufferAttribute(colors,3));

  material = new THREE.PointsMaterial({
    size: parameter.size,
    sizeAttenuation: true,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    vertexColors:true,
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
};
gui
  .add(parameter, "count")
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(generateGalaxy);
gui
  .add(parameter, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameter, "radius")
  .min(0.01)
  .max(20)
  .step(0.01)
  .onFinishChange(generateGalaxy);
gui
  .add(parameter, "branches")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameter, "spin")
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameter, "randomness")
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameter, "randomnessPower")
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .addColor(parameter, "insideColor")
  .onFinishChange(generateGalaxy);
gui
  .addColor(parameter, "outsideColor")
  .onChange((color)=>{

  })
  .onFinishChange(generateGalaxy);

generateGalaxy();

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

  //spining galaxy

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
