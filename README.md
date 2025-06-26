# 📷 PiVision3D – Mobile App + Raspberry Pi Camera + 3D AI Editor

![Languages](./91ed933c-94b2-43bb-9537-d4dfea13e2ce.png)

**PiVision3D** is an AI-powered mobile-first application that connects seamlessly to a Raspberry Pi Camera. It allows users to view and edit images in 3D using advanced transformation controls and generate stereo wiggle animations through AI-powered depth estimation. The frontend is built with TypeScript, while native mobile modules are implemented in Kotlin (Android) and Objective-C++ (iOS). Ruby scripts support automation on the Raspberry Pi server.

---

## 🚀 Features

* 🛁 **Raspberry Pi Hosted App**
  Serve the app directly from the Raspberry Pi over local or remote networks.

* 🖼 **Real-Time 3D Image Editor**
  Adjust rotation, scale, perspective, brightness, and more using touch-friendly UI.

* 🌀 **AI-Powered Stereo Wiggle Effects**
  Transform a single 2D image into a depth-based stereo animation using neural depth estimation.

* 📱 **Cross-Platform Native Integration**

  * Android support via Kotlin modules
  * iOS support via Objective-C++ bridge

* 🪰 **Offline & Lightweight**
  Built for performance on mobile and embedded devices.

---

## 📁 Project Structure

```
/
├── frontend/             # PWA frontend (React or Svelte, TypeScript)
├── android-app/          # Android native modules (Kotlin)
├── ios-app/              # iOS native modules (Objective-C++)
├── pi-server/            # Raspberry Pi server (Flask or Express)
├── scripts/              # Ruby automation/image-processing scripts
└── README.md
```

---

## 🛠 Technologies Used

| Language / Tool          | Purpose                                     |
| ------------------------ | ------------------------------------------- |
| **TypeScript (78.4%)**   | Frontend 3D editor and UI logic             |
| **Kotlin (9.2%)**        | Android image processing and Pi streaming   |
| **Ruby (6.3%)**          | Server-side automation and conversion tools |
| **Objective-C++ (5.3%)** | iOS integration and performance modules     |
| **Other (0.8%)**         | Supporting config and scripts               |

---

## 📲 Usage Instructions

### 1. Raspberry Pi Setup

```bash
sudo apt update
sudo apt install python3-flask python3-picamera
git clone https://github.com/yourusername/pivision3d.git
cd pivision3d/pi-server
python3 app.py
```

* Access the web UI from any mobile browser at `http://<raspberry-pi-ip>:5000`

### 2. Mobile App (Optional)

Build native wrapper for enhanced camera or offline features:

```bash
# Android
cd android-app
./gradlew installDebug

# iOS (Xcode required)
cd ios-app
open PiVision3D.xcworkspace
```

---

## 🧠 Wiggle Stereo Effect Workflow

1. Capture or upload an image.
2. AI model estimates depth map.
3. Synthetic stereo frames are generated.
4. Animated wiggle effect rendered in real-time.

---

## 🧑‍💻 Contribution

Contributions are welcome! To propose changes:

1. Fork the repo
2. Create a new branch
3. Submit a pull request with clear documentation

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👋 Author

**Damilare Peter**
Built for creators who love 3D, AI, and Raspberry Pi innovation.

---

## 🧽 More Resources

* [Starter Raspberry Pi Flask Server](f)
* [Sample Wiggle Depth Estimation Model](f)
* [Figma Design for UI](f)
