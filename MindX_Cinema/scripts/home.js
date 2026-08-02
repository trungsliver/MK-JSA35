import { TMDB_API_KEY } from "./config.js";

// Hàm IIFE (Immediately Invoked Function Expression) để tải dữ liệu khi trang được load
(async () => {
  // Định nghĩa các tuyến API để lấy danh sách phim từ TMDB
  const HomeAPIRoutes = {
    "Trending Movies": { url: "/trending/movie/week" }, // Phim xu hướng trong tuần
    "Popular Movies": { url: "/movie/popular" }, // Phim phổ biến
    "Top Rated Movies": { url: "/movie/top_rated" }, // Phim có đánh giá cao nhất
    "Now Playing at Theatres": { url: "/movie/now_playing" }, // Phim đang chiếu tại rạp
    "Upcoming Movies": { url: "/movie/upcoming" }, // Phim sắp ra mắt
  };

  // Gửi yêu cầu đến API TMDB để lấy dữ liệu phim của từng danh mục
  const promises = await Promise.all(
    Object.keys(HomeAPIRoutes).map(
      async (item) =>
        await (
          await fetch(
            `https://api.themoviedb.org/3${HomeAPIRoutes[item].url}?api_key=${TMDB_API_KEY}`
          )
        ).json()
    )
  );

  // Xử lý dữ liệu trả về và gán vào một đối tượng `data`
  const data = promises.reduce((final, current, index) => {
    final[Object.keys(HomeAPIRoutes)[index]] = current.results;
    return final;
  }, {});

  // Lấy danh sách phim "Trending Movies"
  const trending = data["Trending Movies"];

  // Chọn một phim ngẫu nhiên để hiển thị trên phần tiêu điểm
  const main = trending[new Date().getDate() % trending.length];

  // Cập nhật giao diện hero section với thông tin phim chính
  document.querySelector(
    "#hero-image"
  ).src = `https://image.tmdb.org/t/p/original${main.backdrop_path}`;
  document.querySelector(
    "#hero-preview-image"
  ).src = `https://image.tmdb.org/t/p/w300${main.poster_path}`;
  document.querySelector("#hero-title").innerText = main.title || main.name;
  document.querySelector("#hero-description").innerText = main.overview;
  document.querySelector("#watch-now-btn").href = `./watch.html?id=${main.id}`;
  document.querySelector("#view-info-btn").href = `./info.html?id=${main.id}`;

  // Tạo danh sách phim cho từng danh mục
  Object.keys(data).map((key, index) => {
    document.querySelector("main").innerHTML += /*html*/ `
    <div class="section">
      <h2>${key}</h2>

      <div class="swiper-${index} swiper">
        <div class="swiper-wrapper">
          ${data[key]
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
  });

  // Ẩn phần loading backdrop sau khi nội dung đã tải xong
  document.querySelector(".backdrop").classList.add("backdrop-hidden");

  // Khởi tạo SwiperJS cho từng danh sách phim
  Object.keys(data).map((key, index) => {
    new Swiper(`.swiper-${index}`, {
      spaceBetween: 30,
      autoplay: { delay: 5000, disableOnInteraction: true }, // Tự động cuộn sau 5 giây
      slidesPerView: "auto",
      loop: true,
      slidesPerGroupAuto: true,
      navigation: {
        prevEl: `.swiper-button-prev`,
        nextEl: `.swiper-button-next`,
      },
    });
  });
})();
