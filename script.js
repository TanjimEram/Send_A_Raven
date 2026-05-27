//https://nbnyazggemnbxpxpjgqc.supabase.co 
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ibnlhemdnZW1uYnhweHBqZ3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NTk3MDEsImV4cCI6MjA5NTQzNTcwMX0.TjdPr0ePgIigkKq7lgaPJnzZQl_JKGy1ub-U3_zU9JY
const SUPABASE_URL = "https://nbnyazggemnbxpxpjgqc.supabase.co ";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ibnlhemdnZW1uYnhweHBqZ3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NTk3MDEsImV4cCI6MjA5NTQzNTcwMX0.TjdPr0ePgIigkKq7lgaPJnzZQl_JKGy1ub-U3_zU9JY";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// System State Variables
let currentSender = "Lord"; // Default identity context

// DOM Elements
const chatStream = document.getElementById('chat-stream');
const messageInput = document.getElementById('message-input');
const sendScrollBtn = document.getElementById('send-scroll-btn');
const identityBanner = document.getElementById('identity-banner');
const animationContainer = document.getElementById('animation-container');
const envelope = document.getElementById('envelope');
const cssRaven = document.getElementById('css-raven');
const statusText = document.getElementById('status-text');

// Identity Mock Switches
const setLordBtn = document.getElementById('set-lord');
const setLadyBtn = document.getElementById('set-lady');

// Setup Quick Emoji Bar Injection Clickers
document.querySelectorAll('.emoji-quick-btn').forEach(button => {
    button.addEventListener('click', () => {
        messageInput.value += button.innerText;
        messageInput.focus();
    });
});

// Update your identity switches to shift perspective classes
setLordBtn.addEventListener('click', () => {
    currentSender = "Lord";
    setLordBtn.classList.add('active');
    setLadyBtn.classList.remove('active');
    identityBanner.innerText = "Logged as: Lord";
    
    // Shift camera perspective
    chatStream.classList.add('view-lord');
    chatStream.classList.remove('view-lady');
    
    fetchChatHistory();
});

setLadyBtn.addEventListener('click', () => {
    currentSender = "Lady";
    setLadyBtn.classList.add('active');
    setLordBtn.classList.remove('active');
    identityBanner.innerText = "Logged as: Lady";
    
    // Shift camera perspective
    chatStream.classList.add('view-lady');
    chatStream.classList.remove('view-lord');
    
    fetchChatHistory();
});

// Also, initialize the default view right at the bottom of script.js
chatStream.classList.add('view-lord');
fetchChatHistory();

// ==========================================
// RENDER ENGINE: BUILD THE CHAT LOG BUBBLES
// ==========================================
// New DOM Targets for Attachments
const attachBtn = document.getElementById('attach-btn');
const fileLoader = document.getElementById('file-loader');
const imagePreviewBar = document.getElementById('image-preview-bar');
const previewName = document.getElementById('preview-name');
const cancelImageBtn = document.getElementById('cancel-image-btn');

let pendingImageBase64 = null; // Holds image data in memory

// When click paperclip, simulate clicking the hidden file input
attachBtn.addEventListener('click', () => fileLoader.click());

// When user selects a file from their phone/computer
fileLoader.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    previewName.innerText = file.name;
    imagePreviewBar.classList.remove('hidden');

    // Convert image to text code (Base64 string) so we can store it in database effortlessly
    const reader = new FileReader();
    reader.onload = (event) => {
        pendingImageBase64 = event.target.result;
    };
    reader.readAsDataURL(file);
});

// Cancel attachment selection
cancelImageBtn.addEventListener('click', () => {
    pendingImageBase64 = null;
    fileLoader.value = "";
    imagePreviewBar.classList.add('hidden');
});

// ==========================================
// RENDER ENGINE WITH IMAGE SUPPORT
// ==========================================
async function fetchChatHistory() {
    try {
        const { data: letters, error } = await supabaseClient
            .from('letters')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;
        chatStream.innerHTML = "";

        if (letters.length === 0) {
            chatStream.innerHTML = `<div class="system-message">The digital parchment vault is blank. Write the first scroll!</div>`;
            return;
        }

        letters.forEach(scroll => {
            const bubble = document.createElement('div');
            const styleClass = scroll.sender.toLowerCase() === 'lord' ? 'sender-lord' : 'sender-lady';
            bubble.className = `scroll-bubble ${styleClass}`;
            
            const timestamp = new Date(scroll.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // If an image URL exists, build an img element frame, otherwise leave empty blank string
            let imgHTML = scroll.image_url ? `<img src="${scroll.image_url}" class="attached-img" />` : "";

            bubble.innerHTML = `
                ${imgHTML}
                <div class="scroll-body">${scroll.message}</div>
                <span class="scroll-time">${timestamp}</span>
            `;

            chatStream.appendChild(bubble);
        });

        chatStream.scrollTop = chatStream.scrollHeight;
    } catch (error) {
        console.error(error);
    }
}

// ==========================================
// ACTION ENGINE DISPATCH WITH ATTACHMENTS
// ==========================================
sendScrollBtn.addEventListener('click', async () => {
    const rawText = messageInput.value.trim();
    // Allow sending if there is text OR an attached image
    if (rawText === "" && !pendingImageBase64) return;

    animationContainer.classList.remove('hidden');
    statusText.innerText = `Sealing ${currentSender}'s scroll...`;

    try {
        // Insert both text message AND the image data link string into Supabase row
        const { error } = await supabaseClient
            .from('letters')
            .insert([{ 
                message: rawText, 
                sender: currentSender,
                image_url: pendingImageBase64 // Dispatches our file data string seamlessly!
            }]);

        if (error) throw error;

        setTimeout(() => {
            statusText.innerText = "The Raven takes flight...";
            envelope.classList.add('hidden');
            cssRaven.className = "raven-avatar flapping";

            setTimeout(() => {
                cssRaven.classList.add('fly-outbound');
                statusText.innerText = "Scroll delivered securely.";

                setTimeout(() => {
                    animationContainer.classList.add('hidden');
                    messageInput.value = "";
                    // Clear out asset tracking variables completely for next runs
                    pendingImageBase64 = null;
                    fileLoader.value = "";
                    imagePreviewBar.classList.add('hidden');
                    
                    fetchChatHistory();
                }, 1500);
            }, 1000);
        }, 1200);

    } catch (error) {
        console.error(error);
        alert("Transmission interrupted.");
        animationContainer.classList.add('hidden');
    }
});
