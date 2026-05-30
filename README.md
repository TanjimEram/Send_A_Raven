# 🐦‍⬛ Citadel Scrolls (Raven Messenger Network)

A hyper-private, real-time messaging application wrapped in an elegant *Game of Thrones* medieval aesthetic. Built from scratch as a personal, intimate alternative to modern social media.

Live Demo: `https://<your-username>.github.io/raven-messenger/`

---

## 🏰 The Core Philosophy

This project was conceived as an antidote to the loud, over-connected, and algorithmic nature of modern public social media networks. It was built specifically for a friend, who appreciates intentional communication and feels out of place on mainstream platforms.

Instead of instant, superficial texts, **Citadel Scrolls** re-imagines digital messaging as an old-school exchange of parchment scrolls. 
* Messages from the **Lord** appear as elegant, flowing cursive parchment.
* Replies from the **Lady** appear as rugged, typewriter-stamped castle stone.
* The camera perspective dynamically shifts depending on who is viewing the vault—ensuring your own sent scrolls always sit on the right, and incoming ravens land on the left.
* Every message dispatch triggers a custom physical CSS animation of a raven sealing, launching, and navigating the skies to deliver the scroll securely.

---

## 🛠️ How We Made It (The Technical Journey)

We built this application using a modern, serverless architecture that bridges a lightweight, fully mobile-responsive frontend with a secure cloud database. 

### 1. The Frontend & Animation Engine
The UI is built using pure **HTML5**, **CSS3**, and **Vanilla JavaScript**. 
* **Typography:** Integrated specialized Google Fonts (`Cinzel`, `Pinyon Script`, and `Special Elite`) to instantly set the medieval atmosphere.
* **Physics & Animation:** To bypass flaky external asset dependencies, we built a hardware-accelerated, custom CSS animation framework. Emojis and interface boundaries scale down, flap, and physically cross the screen coordinates using CSS matrix transformations (`@keyframes`) when a transmission initiates.
* **Mobile Responsiveness:** Designed from day one using CSS Media Queries to adapt flawlessly to modern smartphone screen sizes, ensuring the chat stream scrolls comfortably on iOS and Android devices.

### 2. The Cloud Vault Backend (Supabase)
To power real-time letter delivery without running an expensive, bulky backend server, we utilized **Supabase** (built on PostgreSQL).
* **Data Layer:** A custom relational table structure (`letters`) tracks metadata, timestamps, specific sender tags (`Lord`/`Lady`), and message bodies.
* **Attachment Engine:** Implemented a base64 encoding pipeline. When a user hooks a photo or image via the attachment paperclip icon, JavaScript captures the asset in memory, converts it into a lightweight text data string, and dispatches it cleanly into an `image_url` data column to render inline chat-media dynamically.

---

## 📂 File Architecture

The repository consists of a clean, static structure designed to run seamlessly on static hosting environments:

```text
├── index.html       # The structural core, typography layouts, and DOM view containers
├── style.css        # The medieval visual themes, responsive media rules, and CSS raven flight paths
├── script.js        # The application brain: perspective toggling, file streaming, and Supabase SDK bridge
└── README.md        # Project overview and journey log
