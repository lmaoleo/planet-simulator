
// When the cursor is moved

function onDocumentMouseMove(event) {
    // Display info box when a body is hovered
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


// When a mouse button is clicked

function onMouseClick(event) {
    // Fix the camera to the clicked body.
}

document.addEventListener('click', onMouseClick)