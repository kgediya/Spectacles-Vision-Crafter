var instantWorldHitTestEventHandler = null;
var transform = script.getTransform();

script.setInstance = function (hitResult) {
  if (hitResult.eventHandler) {
    instantWorldHitTestEventHandler = hitResult.eventHandler;
  }
  transform.setWorldPosition(hitResult.hits[0].position);
  var rotation = quat.lookAt(hitResult.hits[0].normal, vec3.up());
  transform.setWorldRotation(rotation);
 global.pivot = script.getSceneObject()   
};

script.onFoundBetterHitTestResult = function (newHitResult) {
  if (instantWorldHitTestEventHandler) {
    instantWorldHitTestEventHandler.off(script.onFoundBetterHitTestResult);
    instantWorldHitTestEventHandler = null;
  }
  transform.setWorldPosition(newHitResult.hits[0].position);
  var rotation = quat.lookAt(newHitResult.hits[0].normal, vec3.up());
  transform.setWorldRotation(rotation);
};