import "./style.css";
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
console.log(OrbitControls);

//Cursors
const cursor = {
  x: 0,
  y: 0,
};
addEventListener("mousemove", (e) => {
  cursor.x = e.clientX/sizes.width-0.5;
  cursor.y = -(e.clientY/sizes.height-0.5);
});

const scene = new THREE.Scene();

//we are making the group so that whatever object we are putting in the group we can move them together
const group = new THREE.Group();
scene.add(group);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "blue" })
);
scene.add(cube);

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

const sizes = {
  width: 800,
  height: 600,
};

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  1000
);

//orthographic camera has parameters as (left,right,top and bottom)
// const aspectRatio=sizes.width/sizes.height
// const camera=new THREE.OrthographicCamera(-1*aspectRatio,1*aspectRatio,1,-1,0.1,100);

camera.position.z = 3;
// camera.position.y = 3;
scene.add(camera);



const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

//controls
const controls=new OrbitControls(camera,canvas);
controls.enableDamping=true;
//controls.target.y=1
//controls.update()


//Clock
const clock = new THREE.Clock();

//Animation
const tick = () => {
  //Clock
  const elapsedTime = clock.getElapsedTime();

  //camera update
  // camera.position.x=Math.sin(cursor.x*Math.PI*2)*3;
  // camera.position.z=Math.cos(cursor.x*Math.PI*2)*3;
  // camera.position.y=cursor.y*5;

  //update object
  // cube.rotation.y = elapsedTime;
  // cube.position.x = Math.cos(elapsedTime);
  // camera.lookAt(cube.position);

  //update control
  controls.update();

  //render
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
