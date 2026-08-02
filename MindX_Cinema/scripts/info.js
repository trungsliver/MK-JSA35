import { TMDB_API_KEY } from "./config.js";

// Lấy thông tin query từ URL
const searchQuery = new URLSearchParams(location.search);

// Lấy ID của bộ phim từ query string
const movieId = searchQuery.get("id");

// Nếu không có ID phim, chuyển hướng về trang chủ
if (!movieId) location.href = "./index.html";

// Mảng chứa các loại dữ liệu cần lấy từ API
const labels = ["data", "casts", "similar"];

(async () => {
  // Gửi yêu cầu API để lấy thông tin phim, danh sách diễn viên và phim tương tự
  const result = (
    await Promise.all([
      (
        await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`
        )
      ).json(),
      (
        await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`
        )
      ).json(),
      (
        await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`
        )
      ).json(),
    ])
  ).reduce((final, current, index) => {
    if (labels[index] === "data") {
      final[labels[index]] = current; // Lưu thông tin chi tiết của phim
    } else if (labels[index] === "casts") {
      final[labels[index]] = current.cast
        .filter((item) => item.name && item.character && item.profile_path) // Lọc diễn viên có đủ thông tin
        .slice(0, 10); // Chỉ lấy 10 diễn viên đầu tiên
    } else if (labels[index] === "similar") {
      final[labels[index]] = current.results; // Lưu danh sách phim tương tự
    }
    return final;
  }, {});

  console.log(result); // Debug thông tin phim trong console

  // Cập nhật hình ảnh nền của trang
  document.querySelector(
    ".background-img"
  ).style.backgroundImage = `url('https://image.tmdb.org/t/p/original${result.data.backdrop_path}')`;

  // Hiển thị thông tin phim trên giao diện
  document.querySelector("#preview-img").src = `https://image.tmdb.org/t/p/w300${result.data.poster_path}`;
  document.querySelector("#movie-title").innerText = result.data.title || result.data.name;
  document.querySelector("#movie-description").innerText = result.data.overview;
  document.querySelector("#watch-now-btn").href = `./watch.html?id=${result.data.id}`;

  // Hiển thị ngày phát hành nếu có
  if (result.data.release_date)
    document.querySelector("#release-date").innerText = `Release Date: ${result.data.release_date}`;

  // Hiển thị thể loại phim nếu có
  if (result.data.genres)
    document.querySelector("#genres").innerHTML = result.data.genres
      .map((genres) => `<span>${genres.name}</span>`)
      .join("");

  // Hiển thị danh sách diễn viên nếu có
  if (result.casts) {
    document.querySelector(".casts-grid").innerHTML = result.casts
      .map(
        (item) => /*html*/ `
          <div>
            <img
              onload="this.style.opacity = '1'"
              class="fade-in"
              src="https://image.tmdb.org/t/p/w200${item.profile_path}"
              alt=""
            />
            <p style="text-align: center">${item.name}</p>
            <p style="text-align: center; color: var(--orange)">${item.character}</p>
          </div>
        `
      )
      .join("");
  }

  // Hiển thị danh sách phim tương tự nếu có
  if (result.similar && result.similar.length > 0)
    document.querySelector("#similar").innerHTML += /*html*/ `
  <div class="section">
    <h2>Similar</h2>
    <div class="swiper">
      <div class="swiper-wrapper">
        ${result.similar
          .map(
            (item) => /*html*/ `
        <a href="./info.html?id=${item.id}" class="swiper-slide" style="width: 200px !important">
          <div class="movie-card">
            <img
              class="fade-in"
              onload="this.style.opacity = '1'"
              src="https://image.tmdb.org/t/p/w200${item.poster_path}"
              alt=""
            />
            <p class="multiline-ellipsis-2">
              ${item.title || item.name}
            </p>
          </div>
        </a>
      `
          )
          .join("\n")} 
      </div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
  </div>
  `;

  // Khởi tạo SwiperJS cho phần phim tương tự
  new Swiper(`.swiper`, {
    spaceBetween: 30,
    autoplay: { delay: 5000, disableOnInteraction: true },
    slidesPerView: "auto",
    loop: true,
    slidesPerGroupAuto: true,
    navigation: {
      prevEl: `.swiper-button-prev`,
      nextEl: `.swiper-button-next`,
    },
  });

  // Ẩn backdrop loading khi dữ liệu đã được tải xong
  document.querySelector(".backdrop").classList.add("backdrop-hidden");

  // Cập nhật tiêu đề trang
  document.title = `${result.data.title || result.data.name} - MindX Cinema`;
})();
