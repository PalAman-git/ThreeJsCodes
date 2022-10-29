import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Int8Attribute } from "three";

//Cursors
const cursor = {
  x: 0,
  y: 0,
};
addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
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
  width: window.innerWidth,
  height: window.innerHeight,
};

//for detection of the resize event and resize the canvas accordingly we use this part
addEventListener("resize", () => {
  //Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//for enabling the full screen mode to the user
addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  }
  else{
    if(document.exitFullscreen){
      document.exitFullscreen();
    }else if(document.webkitExitFullscreen){
      document.webkitExitFullscreen();
    }
  }
  //safari does'nt support this for safari we have written the above code

  // if (!document.fullscreenElement) {
  //   canvas.requestFullscreen();
  // } else {
  //   document.exitFullscreen();
  // }
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  1000
);

camera.position.z = 3;
scene.add(camera);

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//Clock
const clock = new THREE.Clock();

//Animation
const tick = () => {
  //Clock
  const elapsedTime = clock.getElapsedTime();

  //update control
  controls.update();

  //render
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
