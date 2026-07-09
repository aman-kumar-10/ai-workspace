const chatBox = document.getElementById("chatBox");

const sendBtn = document.getElementById("sendBtn");

const messageInput = document.getElementById("message");

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter" && !e.shiftKey) {

        e.preventDefault();

        sendMessage();

    }

});

async function sendMessage() {

    const message = messageInput.value.trim();

    if (message === "") return;

    appendMessage(message, "user");

    messageInput.value = "";

    const loading = document.createElement("div");

    loading.className = "message ai loading";

    loading.innerHTML = "Thinking...";

    chatBox.appendChild(loading);

    scrollBottom();

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

        loading.remove();

        appendMessage(data.reply, "ai");

    }

    catch (error) {

        loading.remove();

        appendMessage("Something went wrong.", "ai");

        console.log(error);

    }

}

function appendMessage(text, type) {

    const div = document.createElement("div");

    div.className = "message " + type;

    div.innerText = text;

    chatBox.appendChild(div);

    scrollBottom();

}

function scrollBottom() {

    chatBox.scrollTop = chatBox.scrollHeight;

}