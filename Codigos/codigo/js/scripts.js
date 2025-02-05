import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const API_URL = 'http://localhost:3000/config/1';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cena = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const ambiente = new THREE.AmbientLight(0x333333, 100);
cena.add(ambiente);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const cubogeometry = new THREE.BoxGeometry();
const cubomaterial = new THREE.MeshStandardMaterial({ color: 0x00FF00 });
const cubo = new THREE.Mesh(cubogeometry, cubomaterial);
cena.add(cubo);

const defaultSettings = {
    Cor_Cubo: '#00FF00',
    Cor_Fundo: '#FFFFFF',
    Luz_Ambiente: 100,
    x: 0,
    y: 0,
    z: 0
};

const cubeSettings = {
    Cor_Cubo: '#00FF00',
    Cor_Fundo: '#FFFFFF',
    Luz_Ambiente: 100,
    x: 0,
    y: 0,
    z: 0
};

async function loadCubeSettings() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao carregar configurações.");
        const data = await response.json();

        Object.assign(cubeSettings, data);

        cubo.material.color.set(cubeSettings.Cor_Cubo);
        cena.background = new THREE.Color(cubeSettings.Cor_Fundo);
        ambiente.intensity = cubeSettings.Luz_Ambiente;
        cubo.position.set(cubeSettings.x, cubeSettings.y, cubeSettings.z);

        gui.updateDisplay();
    } catch (error) {
        console.error("Erro ao carregar configurações:", error);
    }
}

async function saveCubeSettings() {
    try {
        await fetch(API_URL, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cubeSettings)
        });
    } catch (error) {
        console.error("Erro ao salvar configurações:", error);
    }
}

async function resetCubeSettings() {
    Object.assign(cubeSettings, defaultSettings);

    cubo.material.color.set(cubeSettings.Cor_Cubo);
    cena.background = new THREE.Color(cubeSettings.Cor_Fundo);
    ambiente.intensity = cubeSettings.Luz_Ambiente;
    cubo.position.set(cubeSettings.x, cubeSettings.y, cubeSettings.z);

    await saveCubeSettings();
    gui.updateDisplay();
}

const gui = new dat.GUI();

gui.addColor(cubeSettings, 'Cor_Cubo').onChange(value => {
    cubo.material.color.set(value);
    saveCubeSettings();
});

gui.addColor(cubeSettings, 'Cor_Fundo').onChange(value => {
    cena.background.set(value);
    saveCubeSettings();
});

gui.add(cubeSettings, 'Luz_Ambiente', 0, 100).onChange(value => {
    ambiente.intensity = value;
    saveCubeSettings();
});

gui.add(cubeSettings, 'x', -4, 4, 0.1).onChange(value => {
    cubo.position.x = value;
    saveCubeSettings();
});

gui.add(cubeSettings, 'y', -4, 4, 0.1).onChange(value => {
    cubo.position.y = value;
    saveCubeSettings();
});

gui.add(cubeSettings, 'z', -4, 4, 0.1).onChange(value => {
    cubo.position.z = value;
    saveCubeSettings();
});

gui.add({ Resetar: resetCubeSettings }, 'Resetar');

loadCubeSettings();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(cena, camera);
}
renderer.setAnimationLoop(animate);
