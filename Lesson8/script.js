// Khai báo link API
const API_URL = "https://dummyjson.com/products";

// Khai báo biến
let products = [];
let filteredProducts = [];
let categories = [];
let currentPage = 1;
const productsPerPage = 8;

// Dùng DOM để lấy các phần tử HTML
const productList = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");
const resetBtn = document.getElementById("resetBtn");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const resultCount = document.getElementById("resultCount");
const totalProducts = document.getElementById("totalProducts");
const totalCategories = document.getElementById("totalCategories");
const averageRating = document.getElementById("averageRating");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");

// Tải dữ liệu sản phẩm từ API.
async function loadProducts() {
    try {
        // Hiển thị trạng thái đang tải.
        showLoading();
        // Gửi request đến API.
        const response = await fetch(API_URL);
        // Kiểm tra phản hồi từ API.
        if (!response.ok) {
            throw new Error("API request failed");
        }
        // Chuyển dữ liệu sang JSON.
        const data = await response.json();
        // Lưu danh sách sản phẩm.
        products = data.products;
        // Sao chép danh sách để lọc.
        filteredProducts = [...products];
        // Ẩn loading sau khi tải xong.
        hideLoading();
        // Tạo danh mục.
        processCategories();
        // Tính thống kê.
        calculateStatistics();
        // Hiển thị sản phẩm.
        displayProducts();
    } catch (error) {
        // Ghi lỗi ra console.
        console.error(error);
        // Ẩn loading khi lỗi.
        hideLoading();
        // Hiển thị thông báo lỗi.
        errorMessage.classList.remove("d-none");
    }
}

// Tạo danh sách danh mục từ dữ liệu sản phẩm.
function processCategories() {
    // Lấy các danh mục không trùng lặp.
    categories = [...new Set(products.map((product) => product.category))];
    // Sắp xếp danh mục theo thứ tự chữ cái.
    categories.sort();
    // Đặt lại nội dung select danh mục.
    categorySelect.innerHTML = '<option value="all">All Categories</option>';
    // Tạo từng option danh mục.
    categories.forEach((category) => {
        // Tạo phần tử option mới.
        const option = document.createElement("option");
        // Gán giá trị cho option.
        option.value = category;
        // Hiển thị tên danh mục dễ đọc.
        option.textContent = formatCategory(category);
        // Thêm option vào select.
        categorySelect.appendChild(option);
    });
}

// Định dạng tên danh mục.
function formatCategory(category) {
    // Thay dấu gạch ngang bằng khoảng trắng.
    return category.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

// Tính các chỉ số thống kê.
function calculateStatistics() {
    // Cập nhật tổng số sản phẩm.
    totalProducts.textContent = products.length;
    // Cập nhật tổng số danh mục.
    totalCategories.textContent = categories.length;
    if (products.length === 0) {
        averageRating.textContent = "0.0";
        return;
    }
    // Tính tổng điểm đánh giá.
    const totalRating = products.reduce((sum, product) => sum + product.rating, 0);
    // Tính điểm trung bình.
    const avg = totalRating / products.length;
    // Hiển thị điểm trung bình.
    averageRating.textContent = avg.toFixed(1);
}

// Hiển thị danh sách sản phẩm theo trang hiện tại.
function displayProducts() {
    // Xóa nội dung cũ.
    productList.innerHTML = "";
    // Kiểm tra nếu không có sản phẩm.
    if (filteredProducts.length === 0) {
        // Hiển thị thông báo không tìm thấy.
        productList.innerHTML = `
        <div class="col-12">
            <div class="alert alert-warning text-center">
                <i class="bi bi-search"></i> 
                No products found.
            </div>
        </div>`;
        // Cập nhật số lượng kết quả.
        resultCount.textContent = 0;
        // Cập nhật phân trang.
        updatePagination();
        // Kết thúc hàm.
        return;
    }
    // Tính vị trí bắt đầu của trang hiện tại.
    const startIndex = (currentPage - 1) * productsPerPage;
    // Tính vị trí kết thúc của trang hiện tại.
    const endIndex = startIndex + productsPerPage;
    // Cắt dữ liệu theo trang.
    const currentProducts = filteredProducts.slice(startIndex, endIndex);
    // Hiển thị từng sản phẩm.
    currentProducts.forEach((product) => {
        // Tạo card sản phẩm.
        const card = createProductCard(product);
        // Thêm card vào danh sách.
        productList.appendChild(card);
    });
    // Cập nhật số lượng kết quả.
    resultCount.textContent = filteredProducts.length;
    // Cập nhật phân trang.
    updatePagination();
}

// Tạo card sản phẩm.
function createProductCard(product) {
    // Tạo cột chứa card.
    const col = document.createElement("div");
    // Gán class cho cột.
    col.className = "col-12 col-sm-6 col-lg-3";
    // Gán nội dung HTML cho card.
    col.innerHTML = `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image-wrapper">
                <img src="${product.thumbnail}" alt="${product.title}" class="product-image" loading="lazy">
            </div>
            <div class="product-body">
                <span class="product-category">${formatCategory(product.category)}</span>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="product-price">$${product.price}</span>
                    <span class="product-rating"><i class="bi bi-star-fill"></i> ${product.rating}</span>
                </div>
                <button class="view-button" onclick="showProductDetail(${product.id})">
                    <i class="bi bi-eye"></i> View Details
                </button>
            </div>
        </div>
    `;
    // Trả về phần tử card.
    return col;
}

// Tìm kiếm sản phẩm theo từ khóa và danh mục.
function searchProducts() {
    // Lấy từ khóa tìm kiếm.
    const keyword = searchInput.value.trim().toLowerCase();
    // Lấy danh mục đang chọn.
    const selectedCategory = categorySelect.value;
    // Lọc sản phẩm theo điều kiện.
    filteredProducts = products.filter((product) => {
        // Kiểm tra tên sản phẩm có khớp không.
        const matchName = product.title.toLowerCase().includes(keyword);
        // Kiểm tra danh mục có khớp không.
        const matchCategory = selectedCategory === "all" || product.category === selectedCategory;
        // Trả về kết quả lọc.
        return matchName && matchCategory;
    });
    // Áp dụng sắp xếp sau khi lọc.
    sortProducts();
}

// Sắp xếp sản phẩm theo tiêu chí đã chọn.
function sortProducts() {
    // Lấy kiểu sắp xếp.
    const sortType = sortSelect.value;
    // Sắp xếp theo giá tăng dần.
    if (sortType === "price-asc") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortType === "price-desc") {
        // Sắp xếp theo giá giảm dần.
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortType === "rating-desc") {
        // Sắp xếp theo rating giảm dần.
        filteredProducts.sort((a, b) => b.rating - a.rating);
    }
    // Quay lại trang đầu tiên.
    currentPage = 1;
    // Hiển thị lại danh sách.
    displayProducts();
}

// Hiển thị chi tiết sản phẩm.
function showProductDetail(productId) {
    // Tìm sản phẩm theo ID.
    const product = products.find((item) => item.id === productId);
    // Dừng lại nếu không tìm thấy.
    if (!product) {
        return;
    }
    // Gán tiêu đề cho modal.
    modalTitle.textContent = product.title;
    // Gán nội dung chi tiết cho modal.
    modalContent.innerHTML = `
        <div class="col-md-6">
            <img src="${product.thumbnail}" alt="${product.title}" class="modal-product-image">
        </div>
        <div class="col-md-6">
            <span class="badge text-bg-warning mb-3">${formatCategory(product.category)}</span>
            <h3>${product.title}</h3>
            <p class="text-muted">${product.description}</p>
            <div class="modal-price mb-3">$${product.price}</div>
            <div class="modal-rating mb-3"><i class="bi bi-star-fill"></i> ${product.rating}</div>
            <p><strong>Brand:</strong> ${product.brand || "Unknown"}</p>
            <p><strong>Stock:</strong> ${product.stock}</p>
            <p><strong>Discount:</strong> ${product.discountPercentage}%</p>
            <p><strong>Warranty:</strong> ${product.warrantyInformation}</p>
            <p><strong>Shipping:</strong> ${product.shippingInformation}</p>
        </div>
    `;
    // Lấy phần tử modal.
    const modalElement = document.getElementById("productModal");
    // Khởi tạo modal Bootstrap.
    const modal = new bootstrap.Modal(modalElement);
    // Hiển thị modal.
    modal.show();
}

// Cập nhật trạng thái phân trang.
function updatePagination() {
    // Tính tổng số trang.
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    // Hiển thị thông tin trang hiện tại.
    pageInfo.textContent = `Page ${currentPage} / ${totalPages || 1}`;
    // Khóa nút trang trước ở trang đầu.
    prevBtn.disabled = currentPage === 1;
    // Khóa nút trang sau ở trang cuối.
    nextBtn.disabled = currentPage >= totalPages;
}

// Chuyển sang trang tiếp theo.
nextBtn.addEventListener("click", () => {
    // Tính tổng số trang.
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    // Kiểm tra còn trang tiếp theo hay không.
    if (currentPage < totalPages) {
        // Tăng số trang hiện tại.
        currentPage++;
        // Hiển thị lại sản phẩm.
        displayProducts();
        // Cuộn đến khu vực sản phẩm.
        scrollToProducts();
    }
});

// Quay về trang trước.
prevBtn.addEventListener("click", () => {
    // Kiểm tra có thể quay lại hay không.
    if (currentPage > 1) {
        // Giảm số trang hiện tại.
        currentPage--;
        // Hiển thị lại sản phẩm.
        displayProducts();
        // Cuộn đến khu vực sản phẩm.
        scrollToProducts();
    }
});

// Lọc khi nhập từ khóa.
searchInput.addEventListener("input", searchProducts);
// Lọc khi đổi danh mục.
categorySelect.addEventListener("change", searchProducts);
// Sắp xếp khi đổi tiêu chí.
sortSelect.addEventListener("change", sortProducts);
// Reset bộ lọc.
resetBtn.addEventListener("click", () => {
    // Xóa từ khóa tìm kiếm.
    searchInput.value = "";
    // Đưa danh mục về mặc định.
    categorySelect.value = "all";
    // Đưa sắp xếp về mặc định.
    sortSelect.value = "default";
    // Khôi phục toàn bộ sản phẩm.
    filteredProducts = [...products];
    // Quay lại trang đầu tiên.
    currentPage = 1;
    // Hiển thị lại danh sách.
    displayProducts();
});

// Hiển thị trạng thái tải dữ liệu.
function showLoading() {
    // Bỏ ẩn loading.
    loading.classList.remove("d-none");
    // Xóa danh sách cũ.
    productList.innerHTML = "";
}
// Ẩn trạng thái tải dữ liệu.
function hideLoading() {
    // Thêm lớp ẩn cho loading.
    loading.classList.add("d-none");
}
// Cuộn đến khu vực sản phẩm.
function scrollToProducts() {
    // Tìm phần tử products.
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

// Khởi tạo ứng dụng.
loadProducts();
