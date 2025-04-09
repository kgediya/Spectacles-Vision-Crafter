//@ui {"widget":"group_start", "label":"Remote Service Setup"}
    //@input Asset.RemoteServiceModule remoteService
    //@input Asset.RemoteMediaModule remoteMedia
   //@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Visual & Scene Configuration"}
    //@input Asset.Material fallbackMaterial
//@input vec3 offset
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Debug / Status"}
    //@input Component.Text statusText
    //@input bool debugMode = false {"label":"Enable Debug Logs"}
//@ui {"widget":"group_end"}

// Runtime flags
var jobId = null
var isPolling = false
var pollingEvent = null
var isAssetLoaded = false
var isModelSpawned = false
script.apiKey = global.meshyApiKey

function logDebug(msg) {
    if (script.debugMode) print("🟨 DEBUG | " + msg)
}

/**
 * Typewriter effect for status text
 */
function typeText(text, speed) {
   script.statusText.text = text
}

/**
 * Submit a Meshy 3D generation request using global.prompt
 */
function submitTextTo3DRequest() {
    logDebug("Submitting new 3D generation request 📝")
 script.statusText.text = "Calling The Minions"
        var url = "https://api.meshy.ai/openapi/v2/text-to-3d";
    var payload = {
        mode: "preview",
        prompt: global.prompt,
        art_style: "realistic",
        should_remesh: true
    };

    var request = new Request(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + script.apiKey
        }
    });
    script.statusText.text = "Turning Pixels Into Pixy Dusts"
    script.remoteService.fetch(request).then(function (response) {
        if (response.status !== 202) {
            print("❌ Job submission failed | Status: " + response.status)
            return
        }
        return response.json()
    }).then(function (json) {
        if (!json || !json.result) {
            print("❌ Malformed job response JSON")
            return
        }

        jobId = json.result
        typeText("🌱 Hold tight cutie...\nYour idea is blooming!")
        logDebug("Job submitted | Task ID: " + jobId)

        beginPollingStatus()
    }).catch(function (err) {
        print("❌ Error during job submission: " + err)
    })
}

/**
 * Begins polling the Meshy API for job progress
 */
function beginPollingStatus() {
    if (isPolling || isAssetLoaded || !jobId) return

    logDebug("Started polling Meshy job status 🔄")
    isPolling = true

    pollingEvent = script.createEvent("DelayedCallbackEvent")
    pollingEvent.bind(function () {
        checkJobStatus()
        if (!isAssetLoaded) pollingEvent.reset(2) // every 2 seconds
    })
    pollingEvent.reset(0)
}

/**
 * Fetches the current status of the Meshy 3D generation task
 */
function checkJobStatus() {
    var url = "https://api.meshy.ai/openapi/v2/text-to-3d/" + jobId

    var request = new Request(url, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + script.apiKey
        }
    })

    script.remoteService.fetch(request).then(function (response) {
        if (response.status !== 200) {
            print("❌ Failed to fetch job status | Status: " + response.status)
            return
        }

        return response.json()
    }).then(function (data) {
        if (!data || !data.status) {
            print("❌ Empty status response")
            return
        }

        var currentStatus = data.status
        logDebug("Current task status: " + currentStatus)

        if (currentStatus === "SUCCEEDED") {
            isAssetLoaded = true
            var modelUrl = data.model_urls.glb
            logDebug("Model ready ✨ | URL: " + modelUrl)

            var glbResource = script.remoteService.makeResourceFromUrl(modelUrl)
            script.remoteMedia.loadResourceAsGltfAsset(glbResource, onModelDownloaded, onModelDownloadFailed)

        } else if (currentStatus === "FAILED") {
            isAssetLoaded = true
            var errorMsg = data.task_error ? data.task_error.message : "No error details"
            print("❌ Task failed | Reason: " + errorMsg)
            typeText("💔 Oopsie... Something broke.\nBut you’re still awesome!")
        } else {
            var progress = Math.floor(data.progress) + "%"
            var cuteLines = [
                "✨ Crafting something magical...",
                "🌈 Mixing pixels and pixie dust...",
                "🧩 Just a few more sparkles...",
                "📦 Shaping your imagination...",
                "🛠️ Your dream’s under construction..."
            ]
            var line = cuteLines[data.progress % cuteLines.length]
            typeText(line + "\nProgress: " + progress)
        }
    }).catch(function (err) {
        print("❌ Error during status poll: " + err)
    })
}

/**
 * Called when the GLTF model is successfully downloaded
 */
function onModelDownloaded(gltfAsset) {
    if (isModelSpawned) return

    global.behaviorSystem.sendCustomTrigger('model-ready')
  global.tweenManager.startTween(global.pivot, 'hide')
    var modelInstance = gltfAsset.tryInstantiate(global.pivot, script.fallbackMaterial)
    if (!modelInstance) {
        print("❌ Failed to instantiate model")
        return
    }

    var pos = modelInstance.getTransform().getWorldPosition()
    modelInstance.getTransform().setWorldPosition(new vec3(pos.x+script.offset.x, pos.y + script.offset.y, pos.z+script.offset.z))
    
    isModelSpawned = true
    typeText("🌟 Ta-da!!\nYour Creation has\ncome to life now 💖")
    logDebug("Model spawned in scene")

    applyFallbackMaterial(modelInstance)
}

/**
 * Called when the GLTF model fails to load
 */
function onModelDownloadFailed(err) {
    print("❌ Failed to load GLTF: " + err)
    typeText("😢 Something went wrong loading your model")
}

/**
 * Recursively apply fallback material to all children
 */
function applyFallbackMaterial(obj) {
    var mesh = obj.getComponent("Component.RenderMeshVisual")
    if (mesh) {
        mesh.mainMaterial = script.fallbackMaterial
    }

    for (var i = 0; i < obj.getChildrenCount(); i++) {
        applyFallbackMaterial(obj.getChild(i))
    }

    logDebug("Fallback materials applied 🌈")
}

//script.createEvent('TapEvent').bind(submitTextTo3DRequest)
// Trigger setup
global.behaviorSystem.addCustomTriggerResponse('start-magic', submitTextTo3DRequest)
