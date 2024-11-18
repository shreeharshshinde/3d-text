import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui';
import playFont from '../node_modules/three/examples/fonts/helvetiker_regular.typeface.json';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import matcap from '../static/textures/matcaps/8.png'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load(matcap)

/**
 * Fonts
 */
const fontLoader = new FontLoader();
fontLoader.load(
  // 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
  './helvetiker_regular.typeface.json',
  (font) => {
    const textGeometry = new TextGeometry('Techumen 2k24', {
      font: font,
      size: 0.5, // Size of the text
      height: 0.2, // Depth of the text
      curveSegments: 12, // Number of segments for curves
      bevelEnabled: true, // Enable bevel
      bevelThickness: 0.03, // Thickness of bevel
      bevelSize: 0.02, // Size of bevel
      bevelSegments: 5, // Number of bevel segments
    });

    // Center the geometry
    textGeometry.center();

    // Create material for the text
    const textMaterial = new THREE.MeshMatcapMaterial({matcap : matcapTexture});
    
    // Create a mesh and add to the scene
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.rotation.y += 20;
    scene.add(textMesh);

    // const torus = new THREE.TorusGeometry(0.1, 0.02, 12, 30);
    // const torus = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const torus = new THREE.SphereGeometry(0.01, 16, 32);
    const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
    for(let i=0; i<1000; ++i){
        const donut = new THREE.Mesh(torus, material);
        donut.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10)
        donut.rotation.set((Math.random() * Math.PI), (Math.random() * Math.PI), (Math.random() * Math.PI))
        const scaling = Math.random();
        donut.scale.set = (scaling, scaling, scaling)
        scene.add(donut);
    }
  }
);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()