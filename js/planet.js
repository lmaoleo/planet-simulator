/**
 * Base of a Sphere that is impacted with gravitation and stuff
 * @param {number} radius Radius of the body
 * @param {string} name Name of the body
 * @param {number} color Color of the body
 * @param {THREE.Vector3} position Position of the body
 * @param {THREE.Vector3} startVector Velocity of the body
 */
class Body
{
    constructor(radius, name, color = 0xffffff, position = new THREE.Vector3(0, 0, 0), startVector = new THREE.Vector3(0, 0, 0)) {
        this.mass = radius * radius * radius;
        this.bodyMesh = makeSphere(radius, 0.5, color);
        this.bodyMesh.name = name;
        // If the given number is a integer, make a Vector3 with the given number as x, y and z.
        if (typeof(position) == "number") {
            this.bodyMesh.position.set(position, position, position);
        } else {
            this.bodyMesh.position.set(position.x, position.y, position.z)
        }
        this.velocity = startVector;
        this.acceleration = new THREE.Vector3(0, 0, 0);
        this.bodyMesh.type = "Body";
        scene.add(this.bodyMesh);
        return this;
    }

    get position() {
        return this.bodyMesh.position;
    }

    set position(position) {
        this.bodyMesh.position.set(position.x, position.y, position.z);
    }

    get radius() {
        return this.bodyMesh.geometry.parameters.radius;
    }

    get color() {
        return this.bodyMesh.material.color;
    }

    addForce(force) {
        this.acceleration.add(force.divideScalar(this.mass));
    }

    gravity(otherBody) {
        let distance = this.position.distanceTo(otherBody.position);
        let force = (G * this.mass * otherBody.mass) / (distance * distance);
        let direction = this.position.clone().sub(otherBody.position);
        direction.normalize();
        this.addForce(direction.multiplyScalar(force));
    }

    updatePosition() {
        this.velocity.add(this.acceleration.clone());
        this.position.add(this.velocity.clone());
    }

    update() {
        this.updatePosition();
        this.acceleration.set(0, 0, 0);
    }
}

/**
 * Body that is affected by light.
 * @param {number} radius Radius of the planet
 * @param {string} name Name of the planet
 * @param {number} color Color of the planet
 * @param {THREE.Vector3} position Position of the planet
 * @param {THREE.Vector3} startVector Velocity of the planet
 */
class Planet extends Body
{
    constructor(radius, name, color = 0xffffff, position = new THREE.Vector3(0, 0, 0), startVector = new THREE.Vector3(0, 0, 0)) {
        super(radius, name, color, position, startVector);
        this.bodyMesh.material = new THREE.MeshPhongMaterial({color: color, opacity: 1, shininess: 0});
        this.bodyMesh.castShadow = true;
        this.bodyMesh.receiveShadow = true;
    }
}

/**
 * Body that emmits light.
 * A Star is not affected by light.
 * @param {number} radius Radius of the planet
 * @param {string} name Name of the planet
 * @param {number} color Color of the planet
 * @param {THREE.Vector3} position Position of the planet
 * @param {THREE.Vector3} startVector Velocity of the planet
 */
class Star extends Body
{
    constructor(radius, name, color = 0xffffff, position = new THREE.Vector3(0, 0, 0), startVector = new THREE.Vector3(0, 0, 0)) {
        super(radius, name, color, position, startVector);
        this.bodyMesh.material.opacity = 1;
        this.effectComposer = addGodRaysEffect(this.bodyMesh);
        this.light = new THREE.PointLight(0xffffff, 5, 50 * radius);
        this.light.castShadow = true;
        this.light.shadow.camera.near = 0.1;
        this.light.shadow.camera.far = 50 * radius;
        this.bodyMesh.castShadow = false;
        this.bodyMesh.receiveShadow = false;
        var lensflare = new THREE.Lensflare();
        lensflare.addElement(new THREE.LensflareElement(textureLoader.load("../images/lensflare1.png"), 90, 2.2));
        lensflare.addElement(new THREE.LensflareElement(textureLoader.load("../images/lensflare1.png"), 60, 1.7));
        lensflare.addElement(new THREE.LensflareElement(textureLoader.load("../images/lensflare1.png"), 75, 1.5));
        lensflare.addElement(new THREE.LensflareElement(textureLoader.load("../images/lensflare1.png"), 60, 1.2));
        this.light.add(lensflare);
        scene.add(this.light);
    }

    get lensflare() {
        return this.light.children[0];
    }

    update() {
        super.update();
        this.light.position.set(this.position.x, this.position.y, this.position.z);
        console.log(this.lensflare);
        this.effectComposer.render(0.1);
    }
}
