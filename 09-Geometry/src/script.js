import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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

//Object
// const geometry=new THREE.BoxGeometry(1, 1, 1);

//to create custom geometries we use this
// const geometry = new THREE.Geometry();

//we are creating 50 triangles
// for (let i = 0; i < 50; i++) {
//pushing 3 vertices in each triangle
//   for (let j = 0; j < 3; j++) {
//     geometry.vertices.push(
//       new THREE.Vector3(
//         (Math.random()-0.5)*4,
//         (Math.random()-0.5)*4,
//         (Math.random()-0.5)*4
//         )
//     );
//   }

//pushing the faces in the vertices
//   const verticesIndex = i * 3;
//   geometry.faces.push(
//     new THREE.Face3(verticesIndex,
//       verticesIndex + 1,
//       verticesIndex + 2
//       )
//   );
// }

//buffer geometries are more efficient and easy to be handled by gpu and the computer so we have to use buffer geometry for better performance

//here is how we create custom buffer geometry
const geometry = new THREE.BufferGeometry();

const count = 500;
const positionsArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = (Math.random()-0.5)*4;
}

const positionsAttribute=new THREE.BufferAttribute(positionsArray,3)
geometry.setAttribute('position',positionsAttribute);

const material = new THREE.MeshBasicMaterial({
  color: "blue",
  wireframe: true,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
//resize
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
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
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
