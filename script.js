import * as THREE from 'https://cdn.skypack.dev/three@0.132.2'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import MouseMeshInteraction from './js/three_mmi.js';

//--------------------------------------------
//                  Sizes
//--------------------------------------------
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

//--------------------------------------------
//           Canvas, Scene, Camera, Renderer
//--------------------------------------------
const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 1000);
camera.position.setZ(30);
scene.add(camera);

const renderer = new THREE.WebGL1Renderer({
    canvas: canvas
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.shadowMap.enabled = true;

//--------------------------------------------
//                  Lights
//--------------------------------------------
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(10,10,10);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);


//--------------------------------------------
//           Geometries, Objects
//--------------------------------------------

//walls
const wall1_geometry = new THREE.BoxGeometry(5, 100, 205);
const wall_material1 = new THREE.MeshStandardMaterial({color: 0x8447f5});
const wall_material2 = new THREE.MeshStandardMaterial({color: 0x5222f5});
const wall_material3 = new THREE.MeshStandardMaterial({color: 0x3447f5});
const wall_material4 = new THREE.MeshStandardMaterial({color: 0x0447f5});
const wall1 = new THREE.Mesh(wall1_geometry, wall_material1);
const wall2 = new THREE.Mesh(wall1_geometry, wall_material2);
const wall3 = new THREE.Mesh(wall1_geometry, wall_material3);
const wall4 = new THREE.Mesh(wall1_geometry, wall_material4);
wall1.name = 'wall1';
wall2.name = 'wall2';
wall3.name = 'wall3';
wall4.name = 'wall4';
wall1.position.set(100,50,0)
wall3.position.set(-100,50,0)
wall2.position.set(0,50,100)
wall4.position.set(0,50,-100)
wall2.rotation.y += Math.PI/2
wall4.rotation.y += Math.PI/2
scene.add(wall1, wall2, wall3, wall4);

//torus:
const geometry = new THREE.TorusGeometry(10, 3, 16, 105);
const material = new THREE.MeshStandardMaterial({color: 0x8447f5});
const torus = new THREE.Mesh(geometry, material);
torus.name = 'torus';
torus.position.set(0,15,0)
scene.add(torus);

//--------------------------------------------
//                  Movement
//--------------------------------------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 1;
controls.maxDistance = 1000;

//--------------------------------------------
//                Interactions
//--------------------------------------------
const mmi = new MouseMeshInteraction(scene, camera);
mmi.addHandler('torus', 'click', function(mesh){
    console.log('torus clicked!');
    mesh.scale.x *=1.1
    mesh.scale.y *=1.1
    mesh.scale.z *=1.1
});
mmi.addHandler('wall1', 'click', function(mesh){
    console.log('wall1 clicked!');

});
mmi.addHandler('wall2', 'click', function(mesh){
    console.log('wall2 clicked!');

});
mmi.addHandler('wall3', 'click', function(mesh){
    console.log('wall3 clicked!');

});
mmi.addHandler('wall4', 'click', function(mesh){
    console.log('wall4 clicked!');

});

//--------------------------------------------
//                 Animating
//--------------------------------------------
function animate(){
    requestAnimationFrame(animate);

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    controls.update();
    mmi.update();
    renderer.render(scene,camera);
};

animate();
