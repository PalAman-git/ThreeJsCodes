import "./style.css";
import * as THREE from "three";

const scene = new THREE.Scene();

//we are making the group so that whatever object we are putting in the group we can move them together
const group=new THREE.Group();
scene.add(group);

const cube1=new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:'blue'})
)
scene.add(cube1);

const cube2=new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:'red'})
)
cube2.position.x=-2;
scene.add(cube2);

const axesHelper=new THREE.AxesHelper();
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

renderer.render(scene, camera);
