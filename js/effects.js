
function addGodRaysEffect(object) {
    var godRaysEffect = new POSTPROCESSING.GodRaysEffect(camera, object, {
        blurriness: 6,
        density: 0.96,
        decay: 0.92,
        weight: 0.3,
        exposure: 0.54,
        clampMax: 1.0,
        samples: 40
    });
    var renderPass = new POSTPROCESSING.RenderPass(scene, camera);
    var effectPass = new POSTPROCESSING.EffectPass(camera, godRaysEffect);
    effectPass.renderToScreen = true;

    composer = new POSTPROCESSING.EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(effectPass);

    return composer;
}
