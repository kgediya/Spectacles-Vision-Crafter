// ----- INPUTS -----
//@ui {"label":"Core Modules", "widget":"group_start"}
//@input Asset.CameraModule cameraModule {"label":"Camera Module"}
//@input Asset.RemoteServiceModule rsm {"label":"Remote Service Module"}
//@input Component.ScriptComponent iht {"label":"Instant Hit Test"}
//@ui {"widget":"group_end"}

//@ui {"label":"Visuals", "widget":"group_start"}
//@input Component.Image previewImage {"label":"Preview Image"}
//@input Component.Text statusText {"label":"Status Text"}
//@input Asset.ObjectPrefab placeholderPrefab {"label":"Placeholder Prefab"}
//@ui {"widget":"group_end"}

// Uses global.openAIKey

// ----- GLOBAL VARS -----
const apiKey = global.openAIKey;
let cameraRequest = null;
let alreadyRequested = false;

// ----- EVENTS -----

// Create image request on start
script.createEvent('OnStartEvent').bind(function () {
    cameraRequest = CameraModule.createImageRequest();
    print("📸 Camera request initialized.");
});

// Capture image and send to OpenAI on custom 'start' trigger
global.behaviorSystem.addCustomTriggerResponse('start', function () {
    if (!alreadyRequested) {
        print("🚀 Trigger received: Starting capture and analysis...");
        processFrame();
        alreadyRequested = true;
    }
});

// Hide preview image when 3D model is ready
global.behaviorSystem.addCustomTriggerResponse('model-ready', function () {
    script.previewImage.getSceneObject().enabled = false;
    print("✅ Model Ready: Hiding preview image.");
});

// ----- PROCESS FUNCTION -----
async function processFrame() {
    try {
        script.statusText.text = "✨ Summoning your view...";
        let imageFrame = await script.cameraModule.requestImage(cameraRequest);

        // Show captured image
        script.previewImage.mainMaterial.mainPass.baseTex = imageFrame.texture;
        script.previewImage.getSceneObject().enabled = true;

        print("🖼️ Image captured. Performing hit test...");
        runHitTest();

        // Convert image to Base64
        script.statusText.text = "🔮 Reading the magical pixels...";
        let base64Image = await encodeTextureToBase64(imageFrame.texture);
   script.statusText.text = "🪄 Casting Spell...";
     
        // Prepare GPT request
        const requestPayload = {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                   content: "You are a visual interpreter for Snapchat AR glasses. Identify the most prominent object or subject from the view. If a drawing is present, treat it as the main object—ignore surfaces (paper, iPad, etc.) and tools (pen, pencil, etc.). Ignore background, lighting, or camera context. Don’t mention the image, medium, or that it’s drawn. Respond with a specific, descriptive 3D asset prompt about the identified main object for Meshy API under 200 characters, no filler.",
  },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "" },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ],
        };
      //  script.statusText.text = "🪄 Calling Wizard...";

        const request = new Request("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestPayload),
        });
script.statusText.text = "🧙‍ Calling The Wizard...";
        let response = await script.rsm.fetch(request);
        //script.statusText.text = "🪄 Grabbing the Rabbit..."+response.status;
        if (response.status === 200) {
            let responseData = await response.json();
              script.statusText.text = "🪄 Reading the Eyes Chico...";
            let content = responseData.choices[0].message.content;
            print("💬 OpenAI Response:" + content);
      
            script.statusText.text = addLineBreaks(content, 5);

            // Store prompt globally
            global.prompt = 'Magical Hat'
            global.prompt = content;
            let delayed = script.createEvent('DelayedCallbackEvent')
            delayed.bind(function(){ global.behaviorSystem.sendCustomTrigger('start-magic');})
            delayed.reset(1)            
            // Trigger next step
           
        } else {
            print("❌ OpenAI API failed:" + response.status);
            script.statusText.text = "🚫 The magic fizzled. Try again.";
        }

    } catch (e) {
        print("⚠️ Error during processing:" + e);
        script.statusText.text = "😵‍💫 Oops! Spell misfired.";
    }
}

// ----- UTILITIES -----

function encodeTextureToBase64(texture) {
    return new Promise((resolve, reject) => {
        Base64.encodeTextureAsync(
            texture,
            resolve,
            reject,
            CompressionQuality.IntermediateQuality,
            EncodingType.Jpg
        );
    });
}

function addLineBreaks(text, wordsPerLine) {
    let words = text.split(' ');
    let result = '';
    for (let i = 0; i < words.length; i++) {
        result += words[i] + ' ';
        if ((i + 1) % wordsPerLine === 0) result += '\n';
    }
    return result.trim();
}

function runHitTest() {
    let centerScreen = new vec2(0.5, 0.5);
    let instance = script.placeholderPrefab.instantiate(script.getSceneObject());
    let prefabLogic = instance.getComponent('Component.ScriptComponent');

    let hitResult = script.iht.hitTest(centerScreen, () => {});
    if (prefabLogic && hitResult) {
        prefabLogic.setInstance(hitResult);
        print("🎯 Hit test succeeded and instance placed.");
    } else {
        print("⚠️ Hit test failed or prefab missing logic.");
    }
}
