import { TMDB_API_KEY } from "./config.js";

// Lấy query tìm kiếm từ URL
const searchQuery = new URLSearchParams(location.search);

// Lấy giá trị của tham số "q" và loại bỏ khoảng trắng thừa
const query = searchQuery.get("q")?.trim();

(async () => {
  // Nếu có truy vấn tìm kiếm, thực hiện gọi API để lấy kết quả
  if (query) {
    const data = await (
      await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          query
        )}&api_key=${TMDB_API_KEY}`
      )
    ).json();

    console.log(data); // In dữ liệu phim ra console để kiểm tra

    // Ẩn form tìm kiếm sau khi có kết quả
    document.querySelector("form").style.display = "none";
    
    // Hiển thị danh sách phim dưới dạng lưới
    document.querySelector("#movie-grid").style.display = "grid";

    // Chèn kết quả tìm kiếm vào phần tử "#movie-grid"
    document.querySelector("#movie-grid").innerHTML = /*html*/ `
    <h1 className="text-2xl mb-8">
      Search result for '${query}'</h1>
    <div>
      ${data.results
        .map(
          (item) => /*html*/ `
            <a href="./info.html?id=${item.id}" >
              <div class="movie-card">
                <img
                  style="width: auto; height: auto; aspect-ratio: 2/3"
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
        .join("")}
    </div>
  `;
  }

  // Ẩn lớp loading (backdrop) sau khi tải xong dữ liệu
  document.querySelector(".backdrop").classList.add("backdrop-hidden");
})();
