// Constant Gravity
const G = -0.1;
const textureLoader =  new THREE.TextureLoader();

function addSkybox(size) {
    let materialArray = [];
    let texture_front = textureLoader.load('images/skybox/front.png');
    let texture_back = textureLoader.load('images/skybox/back.png');
    let texture_top = textureLoader.load('images/skybox/top.png');
    let texture_bottom = textureLoader.load('images/skybox/bottom.png');
    let texture_right = textureLoader.load('images/skybox/right.png');
    let texture_left = textureLoader.load('images/skybox/left.png');

    materialArray.push(new THREE.MeshBasicMaterial({map: texture_right}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_left}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_top}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_bottom}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_front}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_back}));

    for (let i = 0; i < 6; i++) {
        materialArray[i].side = THREE.BackSide;
    }

    let skyboxGeo = new THREE.BoxGeometry(size, size, size);
    let skybox = new THREE.Mesh(skyboxGeo, materialArray);
    scene.add(skybox);
    return skybox;
}

function addStars(min, max, start, end, deadZoneA, deadZoneB) {
    for (i = min; i <= max; i++) {
        var star = makeSphere(1, 1, 0xb5b5b5);
        while (star.position.x > deadZoneA && star.position.x < deadZoneB &&
               star.position.y > deadZoneA && star.position.y < deadZoneB &&
               star.position.z > deadZoneA && star.position.z < deadZoneB) {
            star.position.set(Math.random() * (end - start) + start, Math.random() * (end - start) + start, Math.random() * (end - start) + start);
        }
        setRadius(star, star.position.distanceTo(new THREE.Vector3(0, 0, 0)) / 1000);
    }
}

function onDocumentMouseMove(event) {
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        var info_box = document.getElementById('info_box');
        if (intersects[0].object.type == 'Body') {
            var body = intersects[0].object;
            Bodys.forEach(function(objBody) {
                if (objBody.bodyMesh.name == intersects[0].object.name) {
                    body = objBody;
                }
            });

            info_box.style.opacity = 1;
            info_box.innerHTML = "Name: " + body.bodyMesh.name + "<br>Mass: " + body.mass + " kg<br>Radius: " + body.radius;
            info_box.style.left = (event.clientX + 10) + 'px';
            info_box.style.top = (event.clientY + 10) + 'px';
        } else {
            info_box.style.opacity = 0;
            info_box.style.left = '0px';
            info_box.style.top = '0px';
        }
    }
}
document.addEventListener('mousemove', onDocumentMouseMove, false);


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