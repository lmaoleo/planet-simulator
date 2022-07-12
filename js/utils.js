
//Scene utils

function addSkybox(size) {
    let materialArray = [];
    // can't load local files, so using html
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


// Sphere Utils

function makeSphere(radius, opacity, color) {
    var sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
    var sphereMaterial = new THREE.MeshBasicMaterial({color: color, opacity: opacity});
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    return sphere;
}

function setRadius(sphere, radius) {
    sphere.scale.set(radius, radius, radius);
}
