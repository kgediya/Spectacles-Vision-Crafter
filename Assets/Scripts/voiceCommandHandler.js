//@ui {"widget":"group_start", "label":"🎙️ VoiceML Configuration"}
//@input Asset.VoiceMLModule voiceML
//@input string keyword = "Boom" {"label":"Magic Keyword"}
//@input string hintPhrase = "Shakalaka Boom Boom" {"label":"Hint Phrase"}
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"🛠️ Text + Debug UI"}
//@input Component.Text statusText
//@input bool printDebug = true {"label": "Print to Logger"}
//@ui {"widget":"group_end"}

// Setup listening options
const listeningOptions = VoiceML.ListeningOptions.create()
listeningOptions.speechRecognizer = VoiceMLModule.SpeechRecognizer.Default
listeningOptions.languageCode = 'en_US'
listeningOptions.shouldReturnAsrTranscription = true

const voiceML = script.voiceML

/**
 * Helper: Logs to Logger if debug is enabled
 */
function debugLog(msg) {
    if (script.printDebug) {
        print("🎤 [VoiceML] " + msg)
    }
}

/**
 * Helper: Updates on-screen status text
 */
function updateStatus(msg) {
    if (script.statusText) {
        script.statusText.getSceneObject().enabled = true
        script.statusText.text = msg
    }
}

// --- VoiceML Event Handlers ---

function onListeningEnabled() {
    voiceML.startListening(listeningOptions)
    debugLog("Listening started")
    updateStatus("🎙️ Say something!")
}

function onListeningDisabled() {
    voiceML.stopListening()
    debugLog("Listening stopped")
    updateStatus("⏹️ Mic turned off")
}

function onListeningError(errorEvent) {
    debugLog("Error: " + errorEvent.error + " | " + errorEvent.description)
    updateStatus("❌ Error occurred")
}

function onListeningUpdate(updateEvent) {
    const rawText = updateEvent.transcription.trim()
    if (rawText === "") return

    updateStatus("Heard: " + rawText)
    debugLog("Heard: " + rawText)

    if (!updateEvent.isFinalTranscription) return

    const finalText = rawText.toLowerCase()
    debugLog("Final: " + finalText)
    updateStatus("🧠 Processing: " + finalText)

    if (finalText.includes(script.keyword.toLocaleLowerCase())) {
        updateStatus("💥 Boom detected! Launching...")
        global.behaviorSystem.sendCustomTrigger("start")
        voiceML.stopListening()
    } else {
        updateStatus("🤔 Try saying "+script.hintPhrase)
    }
}

// Register listeners
voiceML.onListeningEnabled.add(onListeningEnabled)
voiceML.onListeningDisabled.add(onListeningDisabled)
voiceML.onListeningError.add(onListeningError)
voiceML.onListeningUpdate.add(onListeningUpdate)
