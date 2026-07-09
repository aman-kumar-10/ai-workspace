/* ===========================================================
   AI Workspace v2
   Part 1
=========================================================== */

/* ===========================
   DOM Elements
=========================== */

const chatBox = document.getElementById("chatBox");

const sendBtn = document.getElementById("sendBtn");

const messageInput = document.getElementById("message");

const newChatBtn = document.getElementById("newChatBtn");

const clearChatBtn = document.getElementById("clearChatBtn");

const themeToggle = document.getElementById("themeToggle");

const charCount = document.getElementById("charCount");

/* ===========================
   State
=========================== */

let isLoading = false;

/* ===========================
   Init
=========================== */

document.addEventListener("DOMContentLoaded", () => {

    autoResize();

    initTheme();

    registerEvents();

});

/* ===========================
   Events
=========================== */

function registerEvents() {

    sendBtn.addEventListener("click", sendMessage);

    newChatBtn.addEventListener("click", startNewChat);

    clearChatBtn.addEventListener("click", clearChat);

    themeToggle.addEventListener("click", toggleTheme);

    messageInput.addEventListener("keydown", handleEnter);

    messageInput.addEventListener("input", () => {

        autoResize();

        updateCounter();

    });

}

/* ===========================
   Send Message
=========================== */

async function sendMessage() {

    if (isLoading) return;

    const text = messageInput.value.trim();

    if (!text) return;

    appendUserMessage(text);

    messageInput.value = "";

    autoResize();

    updateCounter();

    showTyping();

    isLoading = true;

    sendBtn.disabled = true;

    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                message: text

            })

        });

        const data = await response.json();

        removeTyping();

        appendAIMessage(cleanResponse(data.reply));

    }

    catch (error) {

        removeTyping();

        appendAIMessage("⚠️ Unable to connect.");

        console.error(error);

    }

    isLoading = false;

    sendBtn.disabled = false;

}

/* ===========================
   Enter
=========================== */

function handleEnter(e){

    if(e.key==="Enter" && !e.shiftKey){

        e.preventDefault();

        sendMessage();

    }

}

/* ===========================
   Auto Height
=========================== */

function autoResize(){

    messageInput.style.height="60px";

    messageInput.style.height=messageInput.scrollHeight+"px";

}

/* ===========================
   Counter
=========================== */

function updateCounter(){

    charCount.innerText=messageInput.value.length;

}

/* ===========================================================
   AI Workspace v2
   Part 2
=========================================================== */

/* ===========================
   User Message
=========================== */

function appendUserMessage(text){

    hideWelcomeScreen();

    const time=getCurrentTime();

    const html=`

    <div class="message user">

        <div class="avatar user-avatar">

            A

        </div>

        <div class="message-content">

            <div class="message-header">

                <div class="message-author">

                    You

                </div>

                <div class="message-time">

                    ${time}

                </div>

            </div>

            <div class="bubble">

                ${escapeHtml(text)}

            </div>

        </div>

    </div>

    `;

    chatBox.insertAdjacentHTML("beforeend",html);

    scrollBottom();

}

/* ===========================
   AI Message
=========================== */

function appendAIMessage(text){

    hideWelcomeScreen();

    const time=getCurrentTime();

    const markdown=marked.parse(text);

    const html=`

    <div class="message ai">

        <div class="avatar ai-avatar">

            <i class="bi bi-stars"></i>

        </div>

        <div class="message-content">

            <div class="message-header">

                <div class="message-author">

                    AI Workspace

                </div>

                <div class="message-time">

                    ${time}

                </div>

            </div>

            <div class="bubble markdown-body">

                ${markdown}

            </div>

            <div class="message-toolbar">

                <button class="toolbar-btn copy-btn">

                    <i class="bi bi-copy"></i>

                </button>

            </div>

        </div>

    </div>

    `;

    chatBox.insertAdjacentHTML("beforeend",html);

    document.querySelectorAll("pre code").forEach((block)=>{

        hljs.highlightElement(block);

    });

    scrollBottom();

}

/* ===========================
   Welcome Screen
=========================== */

function hideWelcomeScreen(){

    const welcome=document.querySelector(".welcome-screen");

    if(welcome){

        welcome.remove();

    }

}

/* ===========================
   Typing
=========================== */

function showTyping(){

    removeTyping();

    const html=`

    <div
        class="message ai"
        id="typingIndicator">

        <div class="avatar ai-avatar">

            <i class="bi bi-stars"></i>

        </div>

        <div class="message-content">

            <div class="bubble">

                <div class="typing">

                    <span></span>

                    <span></span>

                    <span></span>

                </div>

            </div>

        </div>

    </div>

    `;

    chatBox.insertAdjacentHTML("beforeend",html);

    scrollBottom();

}

function removeTyping(){

    const typing=document.getElementById("typingIndicator");

    if(typing){

        typing.remove();

    }

}

/* ===========================
   New Chat
=========================== */

function startNewChat(){

    chatBox.innerHTML=`

        <div class="welcome-screen">

            <div class="welcome-icon">

                <i class="bi bi-stars"></i>

            </div>

            <h1>

                Welcome to AI Workspace

            </h1>

            <p>

                Ask me anything to begin a new conversation.

            </p>

        </div>

    `;

}

/* ===========================
   Clear Chat
=========================== */

function clearChat(){

    if(confirm("Clear current conversation?")){

        startNewChat();

    }

}

/* ===========================
   Scroll
=========================== */

function scrollBottom(){

    chatBox.scrollTo({

        top:chatBox.scrollHeight,

        behavior:"smooth"

    });

}


/* ===========================================================
   AI Workspace v2
   Part 3
=========================================================== */

/* ===========================
   Theme
=========================== */

function initTheme(){

    const theme=localStorage.getItem("theme");

    if(theme==="dark"){

        document.body.classList.add("dark");

        themeToggle.innerHTML='<i class="bi bi-sun-fill"></i>';

    }

}

function toggleTheme(){

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeToggle.innerHTML='<i class="bi bi-sun-fill"></i>';

    }else{

        localStorage.setItem("theme","light");

        themeToggle.innerHTML='<i class="bi bi-moon-stars"></i>';

    }

}

/* ===========================
   Copy Button
=========================== */

document.addEventListener("click",(e)=>{

    const btn=e.target.closest(".copy-btn");

    if(!btn) return;

    const bubble=btn.closest(".message-content").querySelector(".bubble");

    const text=bubble.innerText;

    navigator.clipboard.writeText(text);

    btn.innerHTML='<i class="bi bi-check-lg"></i>';

    setTimeout(()=>{

        btn.innerHTML='<i class="bi bi-copy"></i>';

    },1500);

});

/* ===========================
   Current Time
=========================== */

function getCurrentTime(){

    return new Date().toLocaleTimeString([],{

        hour:"2-digit",

        minute:"2-digit"

    });

}

/* ===========================
   Clean Gemini Response
=========================== */

function cleanResponse(text){

    return text

        .trim()

        // Remove 3+ blank lines
        .replace(/\n{3,}/g,"\n\n")

        // Remove spaces at line start
        .replace(/^[ \t]+/gm,"")

        // Remove trailing spaces
        .replace(/[ \t]+$/gm,"")

        // Remove multiple spaces
        .replace(/[ \t]{2,}/g," ")

        // Remove zero-width spaces
        .replace(/\u200B/g,"");

}

/* ===========================
   Escape HTML
=========================== */

function escapeHtml(text){

    const div=document.createElement("div");

    div.innerText=text;

    return div.innerHTML;

}

/* ===========================
   Notification
=========================== */

function toast(message){

    const toast=document.createElement("div");

    toast.className="toast-msg";

    toast.innerText=message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },100);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },300);

    },1800);

}

/* ===========================
   Keyboard Shortcut
=========================== */

document.addEventListener("keydown",(e)=>{

    if(e.ctrlKey && e.key.toLowerCase()==="l"){

        e.preventDefault();

        clearChat();

    }

});

/* ===========================
   Prompt Cards
=========================== */

document.addEventListener("click",(e)=>{

    const card=e.target.closest(".prompt-card");

    if(!card) return;

    const text=card.innerText.trim();

    messageInput.value=text;

    updateCounter();

    autoResize();

    messageInput.focus();

});


/* ===========================================================
   AI Workspace v2
   Part 4
=========================================================== */

/* ===========================
   AI Streaming Effect
=========================== */

async function typeWriter(container, text, speed = 8) {

    const markdownBody = container.querySelector(".markdown-body");

    let current = "";

    const words = text.split(" ");

    for (let i = 0; i < words.length; i++) {

        current += words[i] + " ";

        markdownBody.innerHTML = marked.parse(current);

        markdownBody.querySelectorAll("pre code").forEach((block) => {

            hljs.highlightElement(block);

        });

        scrollBottom();

        await new Promise(resolve => setTimeout(resolve, speed));

    }

}

/* ===========================
   Better AI Message
=========================== */

async function appendStreamingAIMessage(text) {

    hideWelcomeScreen();

    const time = getCurrentTime();

    const html = `

    <div class="message ai">

        <div class="avatar ai-avatar">

            <i class="bi bi-stars"></i>

        </div>

        <div class="message-content">

            <div class="message-header">

                <div class="message-author">

                    AI Workspace

                </div>

                <div class="message-time">

                    ${time}

                </div>

            </div>

            <div class="bubble markdown-body">

            </div>

            <div class="message-toolbar">

                <button class="toolbar-btn copy-btn">

                    <i class="bi bi-copy"></i>

                </button>

            </div>

        </div>

    </div>

    `;

    chatBox.insertAdjacentHTML("beforeend", html);

    const message = chatBox.lastElementChild;

    await typeWriter(message, cleanResponse(text));

}

/* ===========================
   API Wrapper
=========================== */

async function askAI(prompt){

    const response = await fetch("/chat",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            message:prompt
        })

    });

    if(!response.ok){

        throw new Error("Server Error");

    }

    return await response.json();

}

/* ===========================
   Replace Old sendMessage()
=========================== */

async function sendMessage(){

    if(isLoading) return;

    const text = messageInput.value.trim();

    if(!text) return;

    appendUserMessage(text);

    messageInput.value="";

    autoResize();

    updateCounter();

    showTyping();

    isLoading=true;

    sendBtn.disabled=true;

    const startTime = performance.now();

    try{

        const data = await askAI(text);

        removeTyping();

        await appendStreamingAIMessage(data.reply);

        const endTime = performance.now();

        console.log(

            "Response Time:",

            ((endTime-startTime)/1000).toFixed(2),

            "sec"

        );

    }

    catch(error){

        removeTyping();

        appendAIMessage(

            "⚠️ Something went wrong while contacting the AI."

        );

        console.error(error);

    }

    isLoading=false;

    sendBtn.disabled=false;

}

/* ===========================
   Future Hooks
=========================== */

function saveChatHistory(){

    // SQLite Later

}

function loadChatHistory(){

    // SQLite Later

}

function renameChat(){

    // SQLite Later

}

function deleteChat(){

    // SQLite Later

}

/* ===========================
   App Ready
=========================== */

console.log(
`
=========================================

        AI Workspace v2

 Backend : FastAPI

 AI      : Google Gemini

 Frontend: HTML/CSS/JS

 Status  : Ready

=========================================
`
);

