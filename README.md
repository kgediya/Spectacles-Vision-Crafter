# Spectacles Vision Crafter 🪄✨  
Turn your sketches into stunning 3D magic — inspired by Shakalaka Boom Boom.

## 📸 What is Vision Crafter?

**Vision Crafter** is an innovative & experimental SnapAR experience that lets you point your **Snapchat Spectacles** at a sketch or doodle, and watch it come alive as a 3D model — just like the magical pencil from *Shakalaka Boom Boom*.

It uses a combination of voice control, camera input, AI vision, and 3D generation to convert **drawings into 3D assets** in real-time.

---

## 🎬 Demo Preview

| Drawing Input | Vision Processing | Final Output 1 | Final Output 2 |
|---------------|--------------------|----------------|----------------|
| ![](./DemoPreview/drawing.gif) | ![](./DemoPreview/progress.gif) | ![](./DemoPreview/ready.gif) | ![](./DemoPreview/ready2.gif) |

---

## ⚙️ Key Features

- **🎨 Drawing-first AI understanding**  
  Detects and prioritizes sketches and doodles as the main object, ignoring canvases like paper, iPad, notebooks, walls, or drawing tools. 

- **🗣️ Voice-activated scanning**  
  Users can trigger the entire vision scan process through **voice commands** via the Voice ML module.

- **📷 Spectacles live view integration**  
  Scene capture powered by **Camera Module** and **Instant World Hit Test** for immediate 3D anchoring to wherever you're looking at.

- **🧠 Smart prompt generation using Vision**  
  Frame data is processed using **OpenAI Vision API** to generate a **precise, 3D-ready text prompt for asset generation**.

- **🌐 3D asset creation using Meshy**  
  Uses **Meshy API** to convert the text prompt into a textured 3D model, streamed back instantly.

- **✨ Edge-fade overlay trick**  
  A visual UX trick to **fade out edges** and avoid harsh overlays for a seamless AR experience.

- **🧊 Remote 3D asset injection**  
  Final 3D model is **injected into the scene** using **Remote Media Module**.

---

## 🧪 Technical Stack

| Feature              | Technology Used                                                                 |
|----------------------|----------------------------------------------------------------------------------|
| Voice Trigger         | [Voice ML Module](https://developers.snap.com/lens-studio/features/voice-ml/speech-recognition) |
| Frame Capture         | [Camera Module](https://developers.snap.com/spectacles/about-spectacles-features/apis/camera-module)  |
| Internet API Calls    | [Remote Service Module (Fetch)](https://developers.snap.com/spectacles/about-spectacles-features/apis/internet-access) |
| Frame Analysis        | [OpenAI GPT-4 Vision API](https://platform.openai.com/docs/guides/images?api-mode=responses)      |
| 3D Model Generation   | [Meshy API](https://docs.meshy.ai/api/text-to-3d)                                               |
| Model Injection       | [Remote Media Module](https://developers.snap.com/lens-studio/api/lens-scripting/classes/Built-In.RemoteMediaModule.html#loadresourceasgltfasset) |
| Anchoring             | [Instant World Hit Test](https://developers.snap.com/lens-studio/features/ar-tracking/world/world-templates/instant-world-hit-test) |
| Platform              | [Lens Studio](https://ar.snap.com/) + [Spectacles](https://www.spectacles.com/?lang=en-US) |


---

## 🧒 Inspired By

Inspired by the Indian TV show **Shakalaka Boom Boom**, where anything you drew with a magic pencil came to life. Vision Crafter brings that fantasy to life using today's cutting-edge tech.

---


---

## 📜 License

This project is licensed under the **MIT License**  
© 2025 **Krunal MB Gediya**

---

## 🤝 Contributions

Open to improvements, issues, and community collabs. Feel free to fork, play, and create some krazyy AR with us.

---
