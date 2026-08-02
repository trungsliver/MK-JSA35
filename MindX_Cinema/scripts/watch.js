import { TMDB_API_KEY } from "./config.js";

// Hàm tính thời gian đã trôi qua từ một thời điểm nhất định
const calculateElapsedTime = (timeCreated) => {
  const created = new Date(timeCreated).getTime();
  let periods = {
    year: 365 * 30 * 24 * 60 * 60 * 1000, // Tính theo năm
    month: 30 * 24 * 60 * 60 * 1000, // Tính theo tháng
    week: 7 * 24 * 60 * 60 * 1000, // Tính theo tuần
    day: 24 * 60 * 60 * 1000, // Tính theo ngày
    hour: 60 * 60 * 1000, // Tính theo giờ
    minute: 60 * 1000, // Tính theo phút
  };
  let diff = Date.now() - created;

  for (const key in periods) {
    if (diff >= periods[key]) {
      let result = Math.floor(diff / periods[key]);
      return `${result} ${result === 1 ? key : key + "s"} ago`;
    }
  }

  return "Just now";
};

// Lấy ID phim từ URL
const searchQuery = new URLSearchParams(location.search);
const movieId = searchQuery.get("id");

// Nếu không có ID phim, chuyển hướng về trang chủ
if (!movieId) location.href = "./index.html";

// Danh sách API cần gọi để lấy thông tin phim
const labels = ["data", "similar"];

(async () => {
  // Gửi yêu cầu API để lấy thông tin phim và phim tương tự
  const result = (
    await Promise.all([
      (
        await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`
        )
      ).json(),
      (
        await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`
        )
      ).json(),
    ])
  ).reduce((final, current, index) => {
    final[labels[index]] = current;
    return final;
  }, {});

  console.log(result); // Debug dữ liệu phim

  // Gán URL phát video vào iframe
  document.querySelector("iframe").src = `https://www.2embed.cc/embed/${result.data.id}`;
  
  // Hiển thị thông tin phim
  document.querySelector("#movie-title").innerText = result.data.title || result.data.name;
  document.querySelector("#movie-description").innerText = result.data.overview;

  if (result.data.release_date)
    document.querySelector("#release-date").innerText = `Release Date: ${result.data.release_date}`;

  // Hiển thị danh sách phim tương tự nếu có
  if (result.similar && result.similar.length > 0)
    document.querySelector("#similar").innerHTML += /*html*/ `
    <h1 className="text-xl">Similar Movies</h1>
    ${result.similar
      .map(
        (item) => /*html*/ `<a href="./info.html?id=${item.id}">
          <div>
            <img
              onload="this.style.opacity = '1'"
              alt=""
              src="https://image.tmdb.org/t/p/w200${item.poster_path}"
            />
            <div>
              <p>${item.title}</p>
            </div>
          </div>
        </a>`
      )
      .join("")} 
  `;

  // Lấy thông tin người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem("currentUser"));

  ///// Tạo giao diện comment
  document.querySelector("#comment-box-container").innerHTML = /*html*/ `
  <form ${!user ? 'style="cursor: pointer" onclick="signIn()"' : ""} class="comment-form" autocomplete="off">
    <img src="${
      user
        ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.username)}`
        : `./assets/default-avatar.png`
    }" />

    <div ${!user ? "onclick='location.href = \"./login.html\"'" : ""}>
      <input
        required
        type="text"
        placeholder="${user ? `Comment as ${user.username}` : "Sign in to comment"}"
        id="comment"
        name="comment"
        ${user ? "" : "style='pointer-events: none'"}
      />
      <button type="submit" ${user ? "" : 'style="display: none"'}>
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </div>
  </form>
  `;

  // Xử lý sự kiện gửi comment
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = e.target.comment.value.trim();
    e.target.comment.value = "";

    const existingComments = JSON.parse(localStorage.getItem(`comments-${movieId}`) || "[]");
    existingComments.push({ title, user: { username: user.username }, createdAt: Date.now() });
    localStorage.setItem(`comments-${movieId}`, JSON.stringify(existingComments));
    renderComments();
  });

  // Hàm hiển thị danh sách comment
  window.renderComments = () => {
    let out = "";
    const comments = JSON.parse(localStorage.getItem(`comments-${movieId}`) || "[]");
    comments.forEach((comment) => {
      out += /*html*/ `
        <div class="comment-item">
          <img src="${comment.user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(comment.user.username)}`}" />
          <div>
            <div>
              <strong>${comment.user.username}</strong>
              <p>${comment.title}</p>
            </div>
           <p>${calculateElapsedTime(comment.createdAt)}</p>
          </div>
        </div> 
      `;
    });
    document.querySelector("#comments").innerHTML = out;
  };

  document.querySelector(".backdrop").classList.add("backdrop-hidden");

  renderComments(); // Hiển thị comment khi trang tải xong
  document.title = `Watch ${result.data.title || result.data.name} - MindX Cinema`;
})();
