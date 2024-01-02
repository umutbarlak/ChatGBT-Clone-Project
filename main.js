const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");
console.log(chatInput);

let userText = null;

const API_KEY = "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";

const initialHeight = chatInput.scrollHeight;

const loadDataFromLocalStorage = () => {
  const themeColor = localStorage.getItem("theme-color");
  document.body.classList.toggle("light-mode", themeColor === "light_mode");

  localStorage.getItem("theme-color");
  themeButton.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";

  const defaultText = `
    <div class= "default-text">
      <h1>ChatGPT Clone</h1>
    </div>
  `;

  chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

loadDataFromLocalStorage();

const createElement = (html, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};

const getChatResponse = async (incomingChatDiv) => {
  const API_URL = "https://api.openai.com/v1/completions";

  const pElement = document.createElement("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: userText,
      max_tokens: 2048,
      temperature: 0.2,
      n: 1,
      stop: null,
    }),
  };

  try {
    const response = await (await fetch(API_URL, requestOptions)).json();

    pElement.textContent = response.choices[0].text.trim();

    console.log(response);
  } catch (error) {
    pElement.textContent = "API yüklenirken bir hata oluştu";
  }

  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  localStorage.setItem("all-chats", chatContainer.innerHTML);
};

const shoeTypingAnimation = async () => {
  const html = `<div class="chat-content">
  <div class="chat-details">
      <img  src="images/gpt.png"  alt="">
      <div class="typing-animation">
          <div class="typing-dot" style="--delay:0.2s"></div>
          <div class="typing-dot" style="--delay:0.3s"></div>
          <div class="typing-dot" style="--delay:0.4s"></div>
      </div>
    </div>
  </div>`;

  const incomingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);

  await getChatResponse(incomingChatDiv);
  document.querySelector("#chat-input").value = "";
};

const handleOutGoingChat = () => {
  userText = chatInput.value.trim();
  if (!userText) return;
  const html = `<div class="chat-content">
    <div class="chat-details">
        <img  src="images/profile.svg" alt="">
        <p> ${userText}</p>
    </div>
   </div>`;

  const outgoingChatDiv = createElement(html, "outgoing");
  outgoingChatDiv.querySelector("p").textContent = userText;
  document.querySelector(".default-text")?.remove();
  chatContainer.appendChild(outgoingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  setTimeout(shoeTypingAnimation, 1000);
};

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  localStorage.setItem("theme-color", themeButton.innerText);
  themeButton.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";
});

deleteButton.addEventListener("click", () => {
  if (confirm("Tüm sohbetleri silmek istediğinizden emin misiniz?")) {
    localStorage.removeItem("all-chats");
    loadDataFromLocalStorage();
  }
});

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${initialHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleOutGoingChat();

    chatInput.style.height = "55px";
  }
});

sendButton.addEventListener("click", handleOutGoingChat);
