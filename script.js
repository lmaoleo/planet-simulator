// Constant Gravity
const G = -0.1;
const textureLoader = new THREE.TextureLoader();


// THREE.js code

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);

var ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);
const renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    antialias: false,
    stencil: false,
    depth: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
document.body.appendChild(renderer.domElement);

camera.position.z = 50;

let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.minDistance = 50;
controls.maxDistance = 220;

// Setup envirement
var skybox = addSkybox(5000);
var zone = skybox.geometry.parameters.width / 2;
addStars(500, 1000, -zone, zone, -zone / 10, zone / 10);

// Bodys
var Bodys = [
    new Star(20, "A Star", 0xff8000),
    new Planet(5, "A planet", 0xad3210, new THREE.Vector3(-440, 0, 0), new THREE.Vector3(0, 0, 1.5)),
    new Planet(1, "A Moon", 0x997a40, new THREE.Vector3(-400, 0, 0), new THREE.Vector3(0, 0, 1)),
];

// Base Loop / "Game" Loop (bcause this is not realy a game)
function animate() {
    // Move with the camera to give illusion of giant space.
    skybox.position.x = camera.position.x / 1.1;
    skybox.position.y = camera.position.y / 1.1;
    skybox.position.z = camera.position.z / 1.1;

    Bodys.forEach(function(body) {
        body.update();
        Bodys.forEach(function(other) {
            if (body !== other) {
                body.gravity(other);
            }
        });
    });

    // Render on screen
	requestAnimationFrame(animate);
}
animate();