import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import gsap from "gsap";

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: "#ffeded",
};

gui.addColor(parameters, "materialColor").onChange(() => {
  toonMaterial.color.set(parameters.materialColor);
  particleMaterial.color.set(parameters.materialColor);
});

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
//Texture
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
gradientTexture.magFilter = THREE.NearestFilter;
const colorTexture=textureLoader.load('/textures/particles/1.png')

//material
const toonMaterial = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});

//meshes
const objectsDistance = 4;
const mesh1 = new THREE.Mesh(
  new THREE.TorusBufferGeometry(1, 0.4, 16, 60),
  toonMaterial
);
const mesh2 = new THREE.Mesh(
  new THREE.ConeBufferGeometry(1, 2, 16, 60),
  toonMaterial
);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotBufferGeometry(0.8, 0.35, 100, 16),
  toonMaterial
);

mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3];

/**
 * Particles
 */

const particleCount = 200;
const particleGeometry = new THREE.BufferGeometry();
const positionArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3;
  positionArray[i3] = (Math.random() - 0.5) * 10;
  positionArray[i3 + 1] =
    objectsDistance * 0.5 -
    Math.random() * objectsDistance * sectionMeshes.length;
  positionArray[i3 + 2] = (Math.random() - 0.5) * 10;
}
particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

const particleMaterial = new THREE.PointsMaterial({
  size: 0.08,
  color: parameters.materialColor,
  sizeAttenuation: true,
  alphaMap:colorTexture,
  depthWrite:false,
  blending:THREE.AdditiveBlending,
});
const particle = new THREE.Points(particleGeometry, particleMaterial);

scene.add(particle);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff");
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

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
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;

addEventListener("scroll", () => {
  scrollY = window.scrollY;

  const newSection = Math.round(scrollY / sizes.height);
  if (newSection != currentSection) {
    currentSection = newSection;

    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=1.5",
    });
  }
});

/**
 * Cursor
 */
const cursor = {
  x: 0,
  y: 0,
};

addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  //animate camera
  camera.position.y = (-scrollY / sizes.height) * objectsDistance;

  const parallaxX = cursor.x * 0.5;
  const parallaxY = cursor.y * 0.5;
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * deltaTime * 5; //easing effect
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * deltaTime * 5; //easing effect

  // animate meshes
  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
