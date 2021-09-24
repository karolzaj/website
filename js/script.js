import * as THREE from 'https://cdn.skypack.dev/three@0.132.2'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import MouseMeshInteraction from './three_mmi.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';
import * as TWEEN from 'https://cdn.skypack.dev/@tweenjs/tween.js';


//--------------------------------------------
//                  Sizes
//--------------------------------------------

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const startPosX = 0;
const startPosY = 50;
const startPosZ = 0;

const rotationAngle = deg2Rad(2.5)

//--------------------------------------------
//                  States
//--------------------------------------------

var roomView = true;
var wallContentView = false;
var wallTarget = 1;
//--------------------------------------------
//      Canvas, Scene, Camera, Renderer
//--------------------------------------------

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 1000);
camera.position.set(startPosX, startPosY, startPosZ);
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
scene.add(ambientLight, pointLight);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);


//--------------------------------------------
//           Geometries, Objects
//--------------------------------------------

//walls
const brick_texture = new THREE.TextureLoader().load('./textures/bricks.jpg');
const brick_normal_map = new THREE.TextureLoader().load('./textures/normal_map_bricks.png');
const bricks = new THREE.MeshStandardMaterial( { map: brick_texture, normalMap: brick_normal_map} );

const wall1_geometry = new THREE.BoxGeometry(5, 100, 205);

const wall1 = new THREE.Mesh(wall1_geometry, bricks);
const wall2 = new THREE.Mesh(wall1_geometry, bricks);
const wall3 = new THREE.Mesh(wall1_geometry, bricks);
const wall4 = new THREE.Mesh(wall1_geometry, bricks);

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

//test object
// const loader = new GLTFLoader();
// loader.load('./models/scene.gltf',     
//     (gltf) => {
//         gltf.scene.scale.set(0.04,0.04,0.04);
//         gltf.scene.position.set(0,40,40)
//         scene.add( gltf.scene );
//     }
// );

//torus:
const geometry = new THREE.TorusGeometry(10, 3, 16, 105);
const material = new THREE.MeshStandardMaterial({color: 0x8447f5});
const torus = new THREE.Mesh(geometry, material);
torus.name = 'torus';
torus.position.set(50,50,50)
scene.add(torus);

//--------------------------------------------
//                  Movement
//--------------------------------------------

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableKeys = false;
controls.enableZoom = false;
controls.enableRotate = false;
controls.minDistance = 10;
controls.maxDistance = 202;
controls.target.set(100,50,0);

//--------------------------------------------
//                Interactions
//--------------------------------------------

//wall focusing by click
const mmi = new MouseMeshInteraction(scene, camera);
mmi.addHandler('torus', 'click', function(mesh){
    console.log('torus clicked!');
    mesh.scale.x *=1.1
    mesh.scale.y *=1.1
    mesh.scale.z *=1.1
});
mmi.addHandler('wall1', 'click', function(mesh){
    if(!wallContentView){
        console.log('wall1 clicked!');
        wallContentView = true;
        roomView = 0;
        changeWallView(wall1.position);
        if (wallTarget==1) {var timeout = 0}
        else {var timeout = 1000}
        setTimeout(() => {  
            document.getElementById("wall1").style.visibility = "visible";
            document.getElementById('wall1').style.animation ="slidein 1s ease-out";
        }, timeout);
        wallTarget = 1;
    }
    else{
        hideWalls();
    }
});
mmi.addHandler('wall2', 'click', function(mesh){
    if(!wallContentView){
        console.log('wall2 clicked!');
        wallContentView = true;
        roomView = false;
        changeWallView(wall2.position);
        if (wallTarget==2) {var timeout = 0}
        else {var timeout = 1000}
        setTimeout(() => {  
            document.getElementById("wall2").style.visibility = "visible";
            document.getElementById('wall2').style.animation ="slidein 1s ease-out";
        }, timeout);
        wallTarget = 2;
    }
    else{
        hideWalls();
    }
});
mmi.addHandler('wall3', 'click', function(mesh){
    if(!wallContentView){
        console.log('wall3 clicked!');
        wallContentView = true;
        roomView = false;
        changeWallView(wall3.position);
        if (wallTarget==3) {var timeout = 0}
        else {var timeout = 1000}
        setTimeout(() => {  
            document.getElementById("wall3").style.visibility = "visible";
            document.getElementById('wall3').style.animation ="slidein 1s ease-out";
        }, timeout);
        wallTarget = 3;
    }
    else{
        hideWalls();
    }
});
mmi.addHandler('wall4', 'click', function(mesh){
    if(!wallContentView){
        console.log('wall4 clicked!');
        wallContentView = true;
        roomView = false;
        changeWallView(wall4.position);
        if (wallTarget==4) {var timeout = 0}
        else {var timeout = 1000}
        setTimeout(() => {  
            document.getElementById("wall4").style.visibility = "visible";
            document.getElementById('wall4').style.animation ="slidein 1s ease-out";
        }, timeout);
        wallTarget = 4;
    }
    else{
        hideWalls();
    }
});

//mouse scrolling
document.addEventListener("mousewheel", function(event){
    var angle = rotationAngle;
    angle += event.wheelDelta/3000;
    var dest = targetCoordsAfterHorizontalRotation(controls.target.x, controls.target.z, angle);
    updateControlsTarget(dest.x, controls.target.y, dest.z);
});

//keyboard scrolling
document.addEventListener('keydown', function(event) {
    if (event.defaultPrevented) {
        return;
    }
    if (event.code === "ArrowLeft"){
        // Handle "left" rotation
        var dest = targetCoordsAfterHorizontalRotation(controls.target.x, controls.target.z, +rotationAngle)
        updateControlsTarget(dest.x, controls.target.y, dest.z);
    } 
    else if (event.code === "ArrowRight"){
        // Handle "right" rotation
        var dest = targetCoordsAfterHorizontalRotation(controls.target.x, controls.target.z, -rotationAngle)
        updateControlsTarget(dest.x, controls.target.y, dest.z);
    }
    event.preventDefault();
}, true);


//--------------------------------------------
//                 Animate
//--------------------------------------------

function animate(){
    requestAnimationFrame(animate);

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    controls.update()
    mmi.update();
    TWEEN.update();
    renderer.render(scene,camera);
    
};

animate();
//--------------------------------------------
//                 Methods/Functions
//--------------------------------------------

function changeWallView(dest){
    var tween_camera = new TWEEN.Tween(camera.position).to({x: 0, y: 50, z: 0}, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
    var tween = new TWEEN.Tween(controls.target).to({ x: dest.x, y: dest.y, z: dest.z }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
}

function deg2Rad(x) {
    return x * Math.PI / 180;
};

function targetCoordsAfterHorizontalRotation(x,z,theta){
    return {x: x*Math.cos(theta) + z*Math.sin(theta), z: -x*Math.sin(theta) + z*Math.cos(theta)}
};

function updateControlsTarget(x,y,z){
    console.log
    var tween = new TWEEN.Tween(controls.target).to({ x: x, y: y, z: z}, 20)
    .easing(TWEEN.Easing.Quadratic.Out).start();
};

function hideWalls(){
    wallContentView = false;
    document.getElementById("wall1").style.visibility = "hidden";
    document.getElementById("wall1").style.animation = "none";
    document.getElementById("wall2").style.visibility = "hidden";
    document.getElementById("wall2").style.animation = "none";
    document.getElementById("wall3").style.visibility = "hidden";
    document.getElementById("wall3").style.animation = "none";
    document.getElementById("wall4").style.visibility = "hidden";
    document.getElementById("wall4").style.animation = "none";
    roomView = true;
}
