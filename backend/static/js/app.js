const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("message");
const newChatBtn = document.getElementById("newChatBtn");

let isLoading = false;

/* ===========================
   Events
=========================== */

sendBtn.addEventListener("click", sendMessage);

newChatBtn.addEventListener("click", startNewChat);

messageInput.addEventListener("keydown", function (e) {

    if (e.key === "Enter" && !e.shiftKey) {

        e.preventDefault();

        sendMessage();

    }

});

messageInput.addEventListener("input", autoResize);

/* ===========================
   Auto Resize
=========================== */

function autoResize() {

    this.style.height = "60px";

    this.style.height = this.scrollHeight + "px";

}

/* ===========================
   Send Message
=========================== */

async function sendMessage() {

    if (isLoading) return;

    const message = messageInput.value.trim();

    if (!message) return;

    appendUserMessage(message);

    messageInput.value = "";

    autoResize.call(messageInput);

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
                message: message
            })

        });

        const data = await response.json();

        removeTyping();

        // appendAIMessage(data.reply.value.trim());
        appendAIMessage(cleanResponse(data.reply));

    } catch (error) {

        removeTyping();

        appendAIMessage("⚠️ Unable to connect to AI.");

        console.error(error);

    }

    isLoading = false;

    sendBtn.disabled = false;

}

/* ===========================
   User Message
=========================== */

function appendUserMessage(text) {

    chatBox.innerHTML += `

    <div class="message user">

        <div class="avatar">

            👤

        </div>

        <div class="bubble">

            ${escapeHtml(text)}

        </div>

    </div>

    `;

    scrollBottom();

}

/* ===========================
   AI Message
=========================== */

function appendAIMessage(text) {

    const html = marked.parse(cleanResponse(text));

    chatBox.innerHTML += `
        <div class="message ai">

            <div class="avatar">
                🤖
            </div>

            <div class="bubble markdown-body">
                ${html}
            </div>

        </div>
    `;

    document.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block);
    });

    scrollBottom();
}

/* ===========================
   Typing Indicator
=========================== */

function showTyping() {

    chatBox.innerHTML += `

    <div
        class="message ai"
        id="typingIndicator">

        <div class="avatar">

            🤖

        </div>

        <div class="bubble">

            Thinking...

        </div>

    </div>

    `;

    scrollBottom();

}

function removeTyping() {

    const typing = document.getElementById("typingIndicator");

    if (typing) {

        typing.remove();

    }

}

/* ===========================
   New Chat
=========================== */

function startNewChat() {

    chatBox.innerHTML = `

    <div class="message ai">

        <div class="avatar">

            🤖

        </div>

        <div class="bubble">

            Hello Aman 👋

            <br><br>

            What would you like to learn today?

        </div>

    </div>

    `;

}

/* ===========================
   Scroll
=========================== */

function scrollBottom() {

    chatBox.scrollTop = chatBox.scrollHeight;

}

/* ===========================
   Escape HTML
=========================== */

function escapeHtml(text) {

    return text

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


function cleanResponse(text) {

    return text
        .trim()
        .replace(/\n{3,}/g, "\n\n");

}