import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm';
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


// Scene
let scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

// Camera
let camera = new THREE.PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(50, 30, 40);
camera.lookAt(0, 0, 0);

// Renderer
let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Orbit Controls
let orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;

// GLSL Loader
const loader = new THREE.FileLoader();
const vertexShader = await loader.loadAsync('./shaders/vertex.glsl');
const fragmentShader = await loader.loadAsync('./shaders/fragment.glsl');

// TAM Loader
const imageLoader = new THREE.TextureLoader();
const copicText1 = await imageLoader.loadAsync('./TAMs/seamless/copic1.jpg');
copicText1.wrapS = THREE.RepeatWrapping;
copicText1.wrapT = THREE.RepeatWrapping;
const copicText2 = await imageLoader.loadAsync('./TAMs/seamless/copic2.jpg');
copicText2.wrapS = THREE.RepeatWrapping;
copicText2.wrapT = THREE.RepeatWrapping;
const copicText3 = await imageLoader.loadAsync('./TAMs/seamless/copic3.jpg');
copicText3.wrapS = THREE.RepeatWrapping;
copicText3.wrapT = THREE.RepeatWrapping;
const copicText4 = await imageLoader.loadAsync('./TAMs/seamless/copic4.jpg');
copicText4.wrapS = THREE.RepeatWrapping;
copicText4.wrapT = THREE.RepeatWrapping;
const copicText5 = await imageLoader.loadAsync('./TAMs/seamless/copic5.jpg');
copicText5.wrapS = THREE.RepeatWrapping;
copicText5.wrapT = THREE.RepeatWrapping;
const copicText6 = await imageLoader.loadAsync('./TAMs/seamless/copic6.jpg');
copicText6.wrapS = THREE.RepeatWrapping;
copicText6.wrapT = THREE.RepeatWrapping;

// Load Test Textures (default)
const testTexture = await imageLoader.loadAsync('./TAMs/test_texture.jpg');
const testTextureShade = await imageLoader.loadAsync('./TAMs/test_texture_shade.jpg');

// Create Copic Material
const copicMaterial = new THREE.ShaderMaterial({ 
    uniforms: {
        u_objectColor:     { value: new THREE.Color(0xffffff) },
        u_shaderColor:     { value: new THREE.Color(0x0000ff) },
        u_lightPos:        { value: new THREE.Vector3(10, 25, 0) },
        u_lightColor:      { value: new THREE.Color(1, 1, 1) },
        u_ambientStrength: { value: 0.15 },
        u_diffuseStrength: { value: 0.7 },
        u_bandCount: { value: 4.0 },
        u_zoom: { value: 2.0 },
        copic1: { value: copicText1},
        copic2: { value: copicText2},
        copic3: { value: copicText3},
        copic4: { value: copicText4},
        copic5: { value: copicText5},
        copic6: { value: copicText6},
        imageTexture: { value: testTexture},
        imageShadeTexture: {value: testTextureShade},
        resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
        u_useEdges: {value: false},
        u_edgeThickness: { value: 1 },
        u_repeat: {value: 1.0},
        u_printMode: {value: false},
        u_textureMode: {value: false},
      },
      vertexShader, fragmentShader
});

// Create Array of Draggable Objects
let draggable = [];

// Create Light
let lightGeo = new THREE.SphereGeometry(2, 16, 16);
let lightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 5.0});
let lightMesh = new THREE.Mesh(lightGeo, lightMat);
lightMesh.position.set(10, 25, 0);
scene.add(lightMesh);
draggable.push(lightMesh);

// Create Objects
let objects = [];

// Torus Knot
const knotGeo = new THREE.TorusKnotGeometry(5, 1.5, 100, 32);
const knotMesh = new THREE.Mesh(knotGeo, copicMaterial);
knotMesh.position.set(0, 8, 0);
scene.add(knotMesh);
objects.push({ mesh: knotMesh, material: copicMaterial, name: 'Torus Knot'});
draggable.push(knotMesh);

// Cube 
const cubeGeo = new THREE.BoxGeometry( 8, 8, 8 );
const cubeMesh = new THREE.Mesh(cubeGeo, copicMaterial);
cubeMesh.position.set(20, 8, 0);
scene.add(cubeMesh);
objects.push({ mesh: cubeMesh, material: copicMaterial, name: 'Cube'});
draggable.push(cubeMesh);

// Teapot
const teapotGeo = new TeapotGeometry(5);
const teapotMesh = new THREE.Mesh(teapotGeo, copicMaterial);
teapotMesh.position.set(-20, 8, 0);
scene.add(teapotMesh);
objects.push({ mesh: teapotMesh, material: copicMaterial, name: 'Teapot'});
draggable.push(teapotMesh);

// Object Drag Controls
const dragControls = new DragControls( draggable, camera, renderer.domElement );
dragControls.addEventListener( 'dragstart', function ( event ) {
    orbit.enabled = false;
} );
dragControls.addEventListener( 'drag', function ( event ) {
    if (event.object == lightMesh) {
        copicMaterial.uniforms.u_lightPos.value.copy(event.object.position);
    }
} );
dragControls.addEventListener( 'dragend', function ( event ) {
    orbit.enabled = true;
} );


// Save Images 
let imageSaver = {
    saveButton: function() {
        let isPrintMode = copicMaterial.uniforms.u_printMode.value;

        // save shaded version
        copicMaterial.uniforms.u_printMode.value = false;

        scene.background = null;
        renderer.render(scene, camera);
        
        let imageData = renderer.domElement.toDataURL("image/png");

        const imageLink = document.createElement('a');

        imageLink.setAttribute('download', 'copic3D.png');
        imageLink.setAttribute('href', imageData);
        imageLink.click();

        // save print mode version version
        copicMaterial.uniforms.u_printMode.value = true;

        renderer.render(scene, camera);
        
        imageData = renderer.domElement.toDataURL("image/png");

        imageLink.setAttribute('download', 'printMode.png');
        imageLink.setAttribute('href', imageData);
        imageLink.click();

        // reset
        scene.background = new THREE.Color(0x1a1a2e);
        copicMaterial.uniforms.u_printMode.value = isPrintMode;
    }
};

// Load Texture from Computer
const textureInput = document.createElement('input');
textureInput.type = 'file';
textureInput.accept = 'image/*';
textureInput.style.display = 'none';
document.body.append(textureInput);

textureInput.addEventListener('change', (e) => {
    const textureFile = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
        let newTexture = imageLoader.load(event.target.result);
        copicMaterial.uniforms.imageTexture.value = newTexture;
        copicMaterial.needsUpdate = true;
    };

    fileReader.readAsDataURL(textureFile);
});

// Load Shade Texture from Computer
const textureShadeInput = document.createElement('input');
textureShadeInput.type = 'file';
textureShadeInput.accept = 'image/*';
textureShadeInput.style.display = 'none';
document.body.append(textureShadeInput);

textureShadeInput.addEventListener('change', (e) => {
    const textureFile = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
        let newTexture = imageLoader.load(event.target.result);
        copicMaterial.uniforms.imageShadeTexture.value = newTexture;
        copicMaterial.needsUpdate = true;
    };

    fileReader.readAsDataURL(textureFile);
});

// Load Custom Object from Computer 
const objInput = document.createElement('input');
objInput.type = 'file';
objInput.accept = '.glb';
objInput.style.display = 'none';
document.body.append(objInput);

const customLoader = new GLTFLoader();

objInput.addEventListener('change', (e) => {
    const objFile = e.target.files[0];
    const tempURL = URL.createObjectURL(objFile);

    customLoader.load(tempURL, function(gltf) {
        const model = gltf.scene;

        model.traverse((child) => {
            if (child.isMesh) {
                child.material = copicMaterial;
            }
        });

        scene.add( gltf.scene );

        URL.revokeObjectURL(tempURL);
    })
});


// Animate Function
animate();

function animate() {
    requestAnimationFrame(animate);
    orbit.update();
    renderer.render(scene, camera);
}

// GUI Setup
const gui = new GUI({ container: document.getElementById('GUI') });

objects.forEach(obj => {
      gui.add(obj.mesh, 'visible').name(obj.name);
});

gui.add({ ambient: 0.15 }, 'ambient', 0, 1, 0.01)
        .name('Ambient')
        .onChange(v => {
            copicMaterial.uniforms.u_ambientStrength.value = v;
        });

gui.add({ diffuse: 0.7 }, 'diffuse', 0, 1, 0.01)
            .name('Diffuse')
            .onChange(v => {
              copicMaterial.uniforms.u_diffuseStrength.value = v;
            });

gui.add({ bandCount: 4.0 }, 'bandCount', 1, 5, 1.0)
        .name('Band Count')
        .onChange(v => {
            copicMaterial.uniforms.u_bandCount.value = v;
        });

gui.add({ zoom: 2.0 }, 'zoom', 0.25, 10, 0.25)
        .name('TAM Zoom')
        .onChange(v => {
            copicMaterial.uniforms.u_zoom.value = v;
        });


const paramColor = {
        color: copicMaterial.uniforms.u_objectColor.value.getHex()
      };

gui.addColor(paramColor, 'color')
        .name('Color')
        .onChange(v => {
            copicMaterial.uniforms.u_objectColor.value.set(v);
        });

const paramShade = {
        color: copicMaterial.uniforms.u_shaderColor.value.getHex()
      };

gui.addColor(paramShade, 'color')
        .name('Shading Color')
        .onChange(v => {
            copicMaterial.uniforms.u_shaderColor.value.set(v);
        });

const edgeFolder = gui.addFolder('Edge Detection');

edgeFolder.add({ useEdges: false }, 'useEdges')
        .name('Use Edges')
        .onChange(v => {
            copicMaterial.uniforms.u_useEdges.value = v;
        });
edgeFolder.add({ edgeThickness: 1 }, 'edgeThickness', 1, 5, 0.2)
        .name('Edge Thickness')
        .onChange(v => {
            copicMaterial.uniforms.u_edgeThickness.value = v;
        });
edgeFolder.add({ repeat: 1.0 }, 'repeat', 0.0, 10.0, 0.2)
        .name('Repeat')
        .onChange(v => {
            copicMaterial.uniforms.u_repeat.value = v;
        });

edgeFolder.close();

const printFolder = gui.addFolder('Print Mode');

printFolder.add({ printMode: false }, 'printMode')
        .name('Print Mode')
        .onChange(v => {
            copicMaterial.uniforms.u_printMode.value = v;
        });

printFolder.add({ edgeThickness: 1 }, 'edgeThickness', 1, 5, 0.2)
        .name('Edge Thickness')
        .onChange(v => {
            copicMaterial.uniforms.u_edgeThickness.value = v;
        });

printFolder.add({ repeat: 1.0 }, 'repeat', 0.0, 10.0, 0.2)
        .name('Repeat')
        .onChange(v => {
            copicMaterial.uniforms.u_repeat.value = v;
        });
printFolder.close();

const textureFolder = gui.addFolder('Image Textures & Custom Models');

textureFolder.add({ textureMode: false }, 'textureMode')
        .name('Texture Mode')
        .onChange(v => {
            copicMaterial.uniforms.u_textureMode.value = v;
        });

textureFolder.add({ upload: () => textureInput.click() }, 'upload').name('Upload Texture (Base Color)');
textureFolder.add({ upload: () => textureShadeInput.click() }, 'upload').name('Upload Texture (Shade Color)');
textureFolder.add({ upload: () => objInput.click() }, 'upload').name('Upload Custom Model (.glb)');
textureFolder.close();


gui.add(imageSaver, 'saveButton')
        .name('Save Image');

        