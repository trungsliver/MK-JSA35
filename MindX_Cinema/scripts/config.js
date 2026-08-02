// Xuất API Key của TMDB để sử dụng trong các yêu cầu API
export const TMDB_API_KEY = "9b7c3ede447b14c5e0e9d33a137ddac9";

// Lắng nghe sự kiện cuộn trang và thay đổi giao diện navbar
addEventListener("scroll", () => {
  if (window.scrollY === 0) {
    document.querySelector(".navbar").classList.remove("navbar-background-visible");
  } else {
    document.querySelector(".navbar").classList.add("navbar-background-visible");
  }
});

// Xử lý đăng xuất: Xóa dữ liệu người dùng và giỏ hàng, sau đó tải lại trang
window.handleSignOut = () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("cart");
  location.reload();
};

// Nếu người dùng đã đăng nhập, hiển thị avatar và nút logout, ngược lại hiển thị nút đăng nhập
if (localStorage.getItem("currentUser")) {
  document.querySelector("#avatar-action-container").innerHTML += /*html*/ `
    <div tabindex="0" class="avatar-action">
      <img src="${`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        JSON.parse(localStorage.getItem("currentUser")).username
      )}`}" />
      <div class="popup">
        <button class="action-button" onclick="handleSignOut()">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span> Logout</span>
        </button>
      </div>
    </div>
  `;
} else {
  document.querySelector("#avatar-action-container").innerHTML += /*html*/ `
    <a style="font-size: 25px" href="./login.html">
      <i class="fa-solid fa-right-to-bracket"></i>
    </a>
  `;
}

// Thêm giao diện chatbot vào trang
// Nút bật/tắt chatbot, hộp thoại chatbot và khu vực nhập tin nhắn
document.body.innerHTML += /*html*/ `
  <button class="chatbot-toggler">
    <span class="material-symbols-rounded">mode_comment</span>
    <span class="material-symbols-outlined">close</span>
  </button>
  <div class="chatbot">
    <header>
      <h2>Chatbot</h2>
      <span class="close-btn material-symbols-outlined">close</span>
    </header>
    <ul class="chatbox">
      <li class="chat incoming">
        <span class="material-symbols-outlined">smart_toy</span>
        <p>Hi there 👋<br />How can I help you today?</p>
      </li>
    </ul>
    <div class="chat-input">
      <textarea placeholder="Enter a message..." spellcheck="false" required></textarea>
      <span id="send-btn" class="material-symbols-rounded">send</span>
    </div>
  </div>
`;

// Lấy phần tử DOM cho chatbot
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Lưu trữ tin nhắn người dùng
const API_KEY = ""; // API key của OpenAI (cần điền vào)
const inputInitHeight = chatInput.scrollHeight;

// Tạo thẻ <li> cho tin nhắn chat
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", `${className}`);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

// Gửi tin nhắn của người dùng và hiển thị phản hồi từ chatbot
const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;
  
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);
  
  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

// Gọi API OpenAI để lấy phản hồi chatbot
const generateResponse = (chatElement) => {
  const API_URL = "https://openai-proxy.napdev.workers.dev?url=https://api.openai.com/v1/chat/completions";
  const messageElement = chatElement.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    }),
  };

  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      messageElement.textContent = data.choices[0].message.content.trim();
    })
    .catch(() => {
      messageElement.classList.add("error");
      messageElement.textContent = "Oops! Something went wrong. Please try again.";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

// Thêm sự kiện cho chatbot
sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

// Google Analytics để theo dõi hành vi người dùng trên trang web
document.body.innerHTML += `
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-VNJX66Z0YF"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "G-VNJX66Z0YF");
  </script>
`;
