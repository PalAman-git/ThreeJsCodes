import "./style.css";
import * as THREE from "three";
import gsap from "gsap";

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

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
scene.add(camera);

//if you want to find the distance between camera and the object you need to do:
// console.log(mesh.position.distanceTo(camera.position));

//if you want your camera to look at something do this:
// camera.lookAt(new THREE.Vector3(3,0,0))
//lookAt function requires 3dVectorObject
// camera.lookAt(mesh.position);

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

//Clock
// const clock =new THREE.Clock();

gsap.to(cube.position,{ x: 2, duration: 1, delay: 1 });
gsap.to(cube.position,{ x: 0, duration: 1, delay: 2 });


//Animation
const tick = () => {
  //Clock
  // const elapsedTime=clock.getElapsedTime();

  //update object
  // camera.position.y = Math.sin(elapsedTime);
  // camera.position.x = Math.cos(elapsedTime);
  camera.lookAt(cube.position);

  //render
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
