import * as THREE from 'https://cdn.skypack.dev/three@0.132.2'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import MouseMeshInteraction from './js/three_mmi.js'

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();


//Boilerplate code

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 1000);
camera.position.setZ(30);
scene.add(camera);

const renderer = new THREE.WebGL1Renderer({
    canvas: canvas
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.shadowMap.enabled = true;

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({
    color: 0x2ed1ae
});

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);



const torus = new THREE.Mesh(geometry, material);
torus.name = 'torus'
scene.add(torus);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 1
controls.maxDistance = 1000

const mmi = new MouseMeshInteraction(scene, camera);
mmi.addHandler('torus', 'click', function(mesh){
    console.log('torus clicked!');
    mesh.scale.x *=1.1
    mesh.scale.y *=1.1
    mesh.scale.z *=1.1
});


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