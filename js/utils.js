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
