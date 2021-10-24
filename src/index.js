import './main.css';
import * as THREE from 'three/build/three.module.js';

import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

import darkS_px from './assets/textures/cube/MilkyWay/dark-s_px.jpg'
import darkS_nx from './assets/textures/cube/MilkyWay/dark-s_nx.jpg'
import darkS_py from './assets/textures/cube/MilkyWay/dark-s_py.jpg'
import darkS_ny from './assets/textures/cube/MilkyWay/dark-s_ny.jpg'
import darkS_pz from './assets/textures/cube/MilkyWay/dark-s_pz.jpg'
import darkS_nz from './assets/textures/cube/MilkyWay/dark-s_nz.jpg'

import lensflare0 from './assets/textures/lensflare/lensflare0.png'
import lensflare3 from './assets/textures/lensflare/lensflare3.png'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer;

let reflector;

let cube;

init();
animate();

function init() {

  const background = new THREE.CubeTextureLoader()
  .load( [ darkS_px, darkS_nx, darkS_py, darkS_ny, darkS_pz, darkS_nz ] );

  scene = new THREE.Scene();
  scene.background = background;

  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
  camera.position.set( 0, 1.6, 2 );
  // camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  let cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
  let cubeMaterial = new THREE.MeshNormalMaterial();
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  scene.add(cube);
  cube.position.x -= 0
  cube.position.y += 1
  cube.position.z -= 2


  const torusGeometry = new THREE.TorusKnotBufferGeometry( 0.4, 0.15, 150, 20 );
  const torusMaterial = new THREE.MeshStandardMaterial( { roughness: 0.01, metalness: 0.2, envMap: background } );
  const torus = new THREE.Mesh( torusGeometry, torusMaterial );
  torus.position.y = 0.75;
  torus.position.z = - 2;
  torus.castShadow = true;
  torus.receiveShadow = true;
  // scene.add( torus );

  const boxGeometry = new THREE.BoxBufferGeometry( 1.5, 0.1, 1.5 );
  const boxMaterial = new THREE.MeshPhongMaterial();
  const box = new THREE.Mesh( boxGeometry, boxMaterial );
  box.position.y = - 0.2;
  box.position.z = - 2;
  box.castShadow = true;
  box.receiveShadow = true;
  scene.add( box );

  const light1 = new THREE.DirectionalLight( 0x8800ff );
  light1.position.set( - 1, 1.5, - 1.5 );
  light1.castShadow = true;
  light1.shadow.camera.zoom = 4;
  scene.add( light1 );
  light1.target.position.set( 0, 0, - 2 );
  scene.add( light1.target );

  // const helper1 = new THREE.CameraHelper( light.shadow.camera );
  // scene.add( helper1 );

  const light2 = new THREE.DirectionalLight( 0xff0000 );
  light2.position.set( 1, 1.5, - 2.5 );
  light2.castShadow = true;
  light2.shadow.camera.zoom = 4;
  scene.add( light2 );
  light2.target.position.set( 0, 0, - 2 );
  scene.add( light2.target );

  // const helper2 = new THREE.CameraHelper( light.shadow.camera );
  // scene.add( helper2 );

  // lensflare
  const loader = new THREE.TextureLoader();
  const texture0 = loader.load( lensflare0 );
  const texture3 = loader.load( lensflare3 );

  const lensflare = new Lensflare();
  lensflare.position.set( 0, 5, - 5 );
  lensflare.addElement( new LensflareElement( texture0, 700, 0 ) );
  lensflare.addElement( new LensflareElement( texture3, 60, 0.6 ) );
  lensflare.addElement( new LensflareElement( texture3, 70, 0.7 ) );
  lensflare.addElement( new LensflareElement( texture3, 120, 0.9 ) );
  lensflare.addElement( new LensflareElement( texture3, 70, 1 ) );
  scene.add( lensflare );

  //

  reflector = new Reflector( new THREE.PlaneBufferGeometry( 1.4, 1.4 ), {
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio
  } );
  reflector.position.x = 1;
  reflector.position.y = 0.5;
  reflector.position.z = - 3;
  reflector.rotation.y = - Math.PI / 4;
  scene.add( reflector );

  const frameGeometry = new THREE.BoxBufferGeometry( 1.5, 1.5, 0.1 );
  const frameMaterial = new THREE.MeshPhongMaterial();
  const frame = new THREE.Mesh( frameGeometry, frameMaterial );
  frame.position.z = - 0.07;
  frame.castShadow = true;
  frame.receiveShadow = true;
  reflector.add( frame );

  //

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.autoClear = false;
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.xr.enabled = true;

  const container = document.createElement( 'div' );
  document.body.appendChild( container );
  container.appendChild( renderer.domElement );

  document.body.appendChild( VRButton.createButton( renderer ) );

  //
  const controls = new OrbitControls( camera, container );
  controls.target.set( 0, 1.6, 0 );
  controls.update();

  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  renderer.setAnimationLoop( render );

}

function render() {
  // requestAnimationFrame( animate );

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;


  const time = performance.now() * 0.0002;
  const torus = scene.children[ 0 ];
  // torus.rotation.x = time * 2 * 0;
  // torus.rotation.y = time * 5 * 0.5;
  // torus.position.x = 0 - time *1
  // torus.position.y = 0.75 + time
  // torus.position.z = - 2 - Math.sin(2 * 3.14 / 5 * time);

  renderer.render( scene, camera );
}