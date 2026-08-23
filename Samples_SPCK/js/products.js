const PRODUCTS_URL = "./data/products.json";
const IMAGE_PATH = "./assets/images/";
const PRODUCTS_PER_PAGE = 16;

let products = [];
let filteredProducts = [];
let productCurrentPage = 1;
let selectedProduct = null;

const elements = {
    productsGrid: document.getElementById("productsGrid"),
    productCount: document.getElementById("productCount"),
    emptyState: document.getElementById("emptyState"),
    pagination: document.getElementById("pagination"),
    paginationFrom: document.getElementById("paginationFrom"),
    paginationTo: document.getElementById("paginationTo"),
    paginationTotal: document.getElementById("paginationTotal"),
    searchInput: document.getElementById("searchInput"),
    clearSearchBtn: document.getElementById("clearSearchBtn"),
    brandFilter: document.getElementById("brandFilter"),
    categoryFilter: document.getElementById("categoryFilter"),
    ratingFilter: document.getElementById("ratingFilter"),
    sortFilter: document.getElementById("sortFilter"),
    minPriceRange: document.getElementById("minPriceRange"),
    maxPriceRange: document.getElementById("maxPriceRange"),
    minPriceLabel: document.getElementById("minPriceLabel"),
    maxPriceLabel: document.getElementById("maxPriceLabel"),
    priceRangeLabel: document.getElementById("priceRangeLabel"),
    activeFilters: document.getElementById("activeFilters"),
    resetFilterBtn: document.getElementById("resetFilterBtn"),
    emptyResetBtn: document.getElementById("emptyResetBtn"),
    modalProductImage: document.getElementById("modalProductImage"),
    modalBrand: document.getElementById("modalBrand"),
    modalProductName: document.getElementById("modalProductName"),
    modalStars: document.getElementById("modalStars"),
    modalRating: document.getElementById("modalRating"),
    modalSold: document.getElementById("modalSold"),
    modalFinalPrice: document.getElementById("modalFinalPrice"),
    modalOriginalPrice: document.getElementById("modalOriginalPrice"),
    modalDiscount: document.getElementById("modalDiscount"),
    modalDiscountText: document.getElementById("modalDiscountText"),
    modalCategory: document.getElementById("modalCategory"),
    modalSubCategory: document.getElementById("modalSubCategory"),
    modalStock: document.getElementById("modalStock"),
    modalDescription: document.getElementById("modalDescription"),
    modalAddCartBtn: document.getElementById("modalAddCartBtn"),
    cartToast: document.getElementById("cartToast"),
    toastProductName: document.getElementById("toastProductName"),
    closeToastBtn: document.getElementById("closeToastBtn")
};

const productModal = new bootstrap.Modal(
    document.getElementById("productDetailModal")
);

document.addEventListener("DOMContentLoaded", init);

async function init() {
    await loadProducts();
    setupEvents();
}

async function loadProducts() {
    try {
        const response = await fetch(PRODUCTS_URL);

        if (!response.ok) {
            throw new Error("Không thể tải products.json");
        }

        products = await response.json();
        filteredProducts = [...products];

        createFilterOptions();
        updatePriceRange();
        renderProducts();
    } catch (error) {
        console.error("Product loading error:", error);
        showEmptyState();
    }
}

function createFilterOptions() {
    const brands = [...new Set(products.map(product => product.brand))]
        .filter(Boolean)
        .sort();

    const categories = [...new Set(products.map(product => product.category))]
        .filter(Boolean)
        .sort();

    brands.forEach(brand => {
        elements.brandFilter.insertAdjacentHTML(
            "beforeend",
            `<option value="${escapeHtml(brand)}">${escapeHtml(brand)}</option>`
        );
    });

    categories.forEach(category => {
        elements.categoryFilter.insertAdjacentHTML(
            "beforeend",
            `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`
        );
    });
}

function setupEvents() {
    elements.searchInput.addEventListener("input", applyFilters);
    elements.brandFilter.addEventListener("change", applyFilters);
    elements.categoryFilter.addEventListener("change", applyFilters);
    elements.ratingFilter.addEventListener("change", applyFilters);
    elements.sortFilter.addEventListener("change", applyFilters);
    elements.minPriceRange.addEventListener("input", handlePriceChange);
    elements.maxPriceRange.addEventListener("input", handlePriceChange);
    elements.clearSearchBtn.addEventListener("click", clearSearch);
    elements.resetFilterBtn.addEventListener("click", resetFilters);
    elements.emptyResetBtn.addEventListener("click", resetFilters);
    elements.modalAddCartBtn.addEventListener("click", addModalProductToCart);
    elements.closeToastBtn.addEventListener("click", hideToast);
}

function applyFilters() {
    const keyword = elements.searchInput.value.trim().toLowerCase();
    const brand = elements.brandFilter.value;
    const category = elements.categoryFilter.value;
    const rating = Number(elements.ratingFilter.value);
    const minPrice = Number(elements.minPriceRange.value);
    const maxPrice = Number(elements.maxPriceRange.value);
    const sortValue = elements.sortFilter.value;

    filteredProducts = products.filter(product => {
        const productName = product.name.toLowerCase();
        const productBrand = product.brand;
        const productCategory = product.category;
        const productRating = Number(product.rating);
        const productPrice = Number(product.finalPrice);

        const matchName = productName.includes(keyword);
        const matchBrand = !brand || productBrand === brand;
        const matchCategory = !category || productCategory === category;
        const matchRating = !rating || productRating >= rating;
        const matchPrice = productPrice >= minPrice && productPrice <= maxPrice;

        return (
            matchName &&
            matchBrand &&
            matchCategory &&
            matchRating &&
            matchPrice
        );
    });

    sortProducts(sortValue);

    productCurrentPage = 1;
    updatePriceLabels();
    updateActiveFilters();
    renderProducts();
}

function sortProducts(sortValue) {
    if (sortValue === "price-asc") {
        filteredProducts.sort(
            (a, b) => Number(a.finalPrice) - Number(b.finalPrice)
        );
    }

    if (sortValue === "price-desc") {
        filteredProducts.sort(
            (a, b) => Number(b.finalPrice) - Number(a.finalPrice)
        );
    }

    if (sortValue === "rating-desc") {
        filteredProducts.sort(
            (a, b) => Number(b.rating) - Number(a.rating)
        );
    }

    if (sortValue === "sold-desc") {
        filteredProducts.sort(
            (a, b) => Number(b.sold) - Number(a.sold)
        );
    }

    if (sortValue === "name-asc") {
        filteredProducts.sort(
            (a, b) => a.name.localeCompare(b.name, "vi")
        );
    }
}

function handlePriceChange(event) {
    let minPrice = Number(elements.minPriceRange.value);
    let maxPrice = Number(elements.maxPriceRange.value);

    if (event.target === elements.minPriceRange && minPrice > maxPrice) {
        elements.minPriceRange.value = maxPrice;
        minPrice = maxPrice;
    }

    if (event.target === elements.maxPriceRange && maxPrice < minPrice) {
        elements.maxPriceRange.value = minPrice;
        maxPrice = minPrice;
    }

    updatePriceLabels();
    applyFilters();
}

function updatePriceRange() {
    const prices = products.map(product => Number(product.finalPrice));
    const highestPrice = Math.max(...prices);

    const roundedMax = Math.ceil(highestPrice / 500000) * 500000;

    elements.minPriceRange.max = roundedMax;
    elements.maxPriceRange.max = roundedMax;
    elements.maxPriceRange.value = roundedMax;

    elements.maxPriceLabel.textContent = formatCurrency(roundedMax);
    elements.minPriceLabel.textContent = formatCurrency(0);
    elements.priceRangeLabel.textContent = "Tất cả mức giá";
}

function updatePriceLabels() {
    const minPrice = Number(elements.minPriceRange.value);
    const maxPrice = Number(elements.maxPriceRange.value);

    elements.minPriceLabel.textContent = formatCurrency(minPrice);
    elements.maxPriceLabel.textContent = formatCurrency(maxPrice);

    if (minPrice === 0 && maxPrice === Number(elements.maxPriceRange.max)) {
        elements.priceRangeLabel.textContent = "Tất cả mức giá";
        return;
    }

    elements.priceRangeLabel.textContent =
        `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
}

function renderProducts() {
    elements.productsGrid.innerHTML = "";

    const totalProducts = filteredProducts.length;

    elements.productCount.textContent =
        `${totalProducts} sản phẩm`;

    if (totalProducts === 0) {
        showEmptyState();
        renderPagination(0);
        updatePaginationInfo(0, 0, 0);
        return;
    }

    elements.emptyState.classList.add("d-none");

    const startIndex =
        (productCurrentPage - 1) * PRODUCTS_PER_PAGE;

    const endIndex =
        Math.min(
            startIndex + PRODUCTS_PER_PAGE,
            totalProducts
        );

    const pageProducts =
        filteredProducts.slice(startIndex, endIndex);

    pageProducts.forEach((product, index) => {
        const card = createProductCard(product, index);
        elements.productsGrid.insertAdjacentHTML("beforeend", card);
    });

    elements.productsGrid
        .querySelectorAll("[data-detail]")
        .forEach(button => {
            button.addEventListener("click", () => {
                const productId = button.dataset.detail;
                openProductDetail(productId);
            });
        });

    elements.productsGrid
        .querySelectorAll("[data-cart]")
        .forEach(button => {
            button.addEventListener("click", () => {
                const productId = button.dataset.cart;
                addToCart(productId);
            });
        });

    updatePaginationInfo(
        startIndex + 1,
        endIndex,
        totalProducts
    );

    renderPagination(totalProducts);
}

function createProductCard(product, index) {
    const image = getProductImage(product.images);
    const rating = Number(product.rating);
    const price = Number(product.price);
    const finalPrice = Number(product.finalPrice);
    const discount = Number(product.discount);

    const animationDelay = `${index * 0.04}s`;

    return `
        <div
            class="col-6 col-md-4 col-lg-3 product-card-wrapper"
            style="animation-delay: ${animationDelay};">

            <article class="product-card">

                <div class="product-image-wrapper">

                    <img
                        src="${image}"
                        class="product-image"
                        alt="${escapeHtml(product.name)}"
                        loading="lazy"
                        onerror="this.src='https://placehold.co/600x600/eee8dc/333?text=Interior';">

                    <div class="product-badges">

                        ${discount > 0 ? `
                            <span class="product-badge discount">
                                -${discount}%
                            </span>
                        ` : ""}

                        ${Number(product.stock) <= 10 ? `
                            <span class="product-badge">
                                LIMITED
                            </span>
                        ` : ""}

                    </div>

                    <div class="product-overlay">

                        <button
                            type="button"
                            class="quick-view-btn"
                            data-detail="${product.id}">

                            <i class="bi bi-eye"></i>
                            Xem nhanh

                        </button>

                    </div>

                </div>

                <div class="product-content">

                    <span class="product-brand">
                        ${escapeHtml(product.brand)}
                    </span>

                    <h3 class="product-name">
                        ${escapeHtml(product.name)}
                    </h3>

                    <p class="product-description">
                        ${escapeHtml(product.description)}
                    </p>

                    <div class="product-rating">

                        <span class="stars">
                            ${createStars(rating)}
                        </span>

                        <span class="rating-number">
                            ${rating.toFixed(1)}
                        </span>

                        <span class="sold-count">
                            | Đã bán ${formatNumber(product.sold)}
                        </span>

                    </div>

                    <div class="product-price">

                        <span class="final-price">
                            ${formatCurrency(finalPrice)}
                        </span>

                        ${price > finalPrice ? `
                            <span class="original-price">
                                ${formatCurrency(price)}
                            </span>

                            <span class="discount-percent">
                                -${discount}%
                            </span>
                        ` : ""}

                    </div>

                    <div class="product-actions">

                        <button
                            type="button"
                            class="btn-product-detail"
                            data-detail="${product.id}">

                            Xem chi tiết

                        </button>

                        <button
                            type="button"
                            class="btn-cart"
                            data-cart="${product.id}"
                            title="Thêm vào giỏ hàng">

                            <i class="bi bi-bag-plus"></i>

                        </button>

                    </div>

                </div>

            </article>

        </div>
    `;
}

function openProductDetail(productId) {
    const product = products.find(
        item => String(item.id) === String(productId)
    );

    if (!product) {
        return;
    }

    selectedProduct = product;

    const rating = Number(product.rating);
    const price = Number(product.price);
    const finalPrice = Number(product.finalPrice);
    const discount = Number(product.discount);
    const stock = Number(product.stock);

    elements.modalProductImage.src =
        getProductImage(product.images);

    elements.modalProductImage.alt = product.name;

    elements.modalBrand.textContent = product.brand;

    elements.modalProductName.textContent = product.name;

    elements.modalStars.innerHTML = createStars(rating);

    elements.modalRating.textContent = rating.toFixed(1);

    elements.modalSold.textContent =
        formatNumber(product.sold);

    elements.modalFinalPrice.textContent =
        formatCurrency(finalPrice);

    elements.modalOriginalPrice.textContent =
        price > finalPrice
            ? formatCurrency(price)
            : "";

    elements.modalDiscountText.textContent =
        discount > 0 ? `-${discount}%` : "";

    elements.modalDiscount.textContent =
        discount > 0 ? `GIẢM ${discount}%` : "";

    elements.modalCategory.textContent =
        product.category;

    elements.modalSubCategory.textContent =
        product.subCategory;

    elements.modalStock.textContent =
        stock > 0
            ? `Còn ${formatNumber(stock)} sản phẩm`
            : "Hết hàng";

    elements.modalDescription.textContent =
        product.description;

    elements.modalAddCartBtn.disabled = stock <= 0;

    elements.modalAddCartBtn.innerHTML =
        stock > 0
            ? `<i class="bi bi-bag-plus"></i> Thêm vào giỏ hàng`
            : `<i class="bi bi-x-circle"></i> Hết hàng`;

    productModal.show();
}

function addModalProductToCart() {
    if (!selectedProduct) {
        return;
    }

    if (Number(selectedProduct.stock) <= 0) {
        return;
    }

    addToCart(selectedProduct.id);
}

function addToCart(productId) {
    const product = products.find(
        item => String(item.id) === String(productId)
    );

    if (!product) {
        return;
    }

    if (Number(product.stock) <= 0) {
        return;
    }

    let cart = getCart();

    const existingProduct = cart.find(
        item => String(item.id) === String(product.id)
    );

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            slug: product.slug,
            brand: product.brand,
            price: product.price,
            finalPrice: product.finalPrice,
            discount: product.discount,
            currency: product.currency,
            images: product.images,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    showToast(product.name);
}

function getCart() {
    try {
        const cart = JSON.parse(
            localStorage.getItem("cart")
        );

        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        return [];
    }
}

function showToast(productName) {
    elements.toastProductName.textContent =
        productName;

    elements.cartToast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(
        hideToast,
        3000
    );
}

function hideToast() {
    elements.cartToast.classList.remove("show");
}

function renderPagination(totalProducts) {
    elements.pagination.innerHTML = "";

    const totalPages =
        Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

    if (totalPages <= 1) {
        return;
    }

    addPaginationButton(
        "prev",
        `<i class="bi bi-chevron-left"></i>`,
        productCurrentPage > 1,
        () => {
            productCurrentPage--;
            renderProducts();
            scrollToProducts();
        }
    );

    const visiblePages = getVisiblePages(
        productCurrentPage,
        totalPages
    );

    visiblePages.forEach(page => {
        if (page === "...") {
            elements.pagination.insertAdjacentHTML(
                "beforeend",
                `
                <li class="page-item disabled">
                    <span class="page-link">...</span>
                </li>
                `
            );

            return;
        }

        addPaginationButton(
            page,
            page,
            true,
            () => {
                productCurrentPage = page;
                renderProducts();
                scrollToProducts();
            },
            page === productCurrentPage
        );
    });

    addPaginationButton(
        "next",
        `<i class="bi bi-chevron-right"></i>`,
        productCurrentPage < totalPages,
        () => {
            productCurrentPage++;
            renderProducts();
            scrollToProducts();
        }
    );
}

function addPaginationButton(
    id,
    content,
    enabled,
    callback,
    active = false
) {
    const li = document.createElement("li");

    li.className =
        `page-item${active ? " active" : ""}${!enabled ? " disabled" : ""}`;

    const button = document.createElement("button");

    button.type = "button";
    button.className = "page-link";
    button.innerHTML = content;

    if (enabled) {
        button.addEventListener("click", callback);
    }

    li.appendChild(button);

    elements.pagination.appendChild(li);
}

function getVisiblePages(current, total) {
    if (total <= 7) {
        return Array.from(
            { length: total },
            (_, index) => index + 1
        );
    }

    if (current <= 3) {
        return [1, 2, 3, 4, "...", total];
    }

    if (current >= total - 2) {
        return [
            1,
            "...",
            total - 3,
            total - 2,
            total - 1,
            total
        ];
    }

    return [
        1,
        "...",
        current - 1,
        current,
        current + 1,
        "...",
        total
    ];
}

function updatePaginationInfo(from, to, total) {
    elements.paginationFrom.textContent = from;
    elements.paginationTo.textContent = to;
    elements.paginationTotal.textContent = total;
}

function updateActiveFilters() {
    const tags = [];

    const keyword =
        elements.searchInput.value.trim();

    const brand =
        elements.brandFilter.value;

    const category =
        elements.categoryFilter.value;

    const rating =
        elements.ratingFilter.value;

    const minPrice =
        Number(elements.minPriceRange.value);

    const maxPrice =
        Number(elements.maxPriceRange.value);

    const maxRange =
        Number(elements.maxPriceRange.max);

    if (keyword) {
        tags.push(
            createFilterTag(
                "Từ khóa",
                keyword
            )
        );
    }

    if (brand) {
        tags.push(
            createFilterTag(
                "Brand",
                brand
            )
        );
    }

    if (category) {
        tags.push(
            createFilterTag(
                "Danh mục",
                category
            )
        );
    }

    if (rating) {
        tags.push(
            createFilterTag(
                "Rating",
                `${rating}.0+`
            )
        );
    }

    if (minPrice > 0 || maxPrice < maxRange) {
        tags.push(
            createFilterTag(
                "Giá",
                `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`
            )
        );
    }

    if (tags.length === 0) {
        elements.activeFilters.classList.add("d-none");
        elements.activeFilters.innerHTML = "";
        return;
    }

    elements.activeFilters.classList.remove("d-none");
    elements.activeFilters.innerHTML = tags.join("");
}

function createFilterTag(label, value) {
    return `
        <span class="filter-tag">
            ${escapeHtml(label)}:
            <strong>${escapeHtml(value)}</strong>
        </span>
    `;
}

function clearSearch() {
    elements.searchInput.value = "";
    applyFilters();
    elements.searchInput.focus();
}

function resetFilters() {
    elements.searchInput.value = "";
    elements.brandFilter.value = "";
    elements.categoryFilter.value = "";
    elements.ratingFilter.value = "";
    elements.sortFilter.value = "";

    elements.minPriceRange.value = 0;
    elements.maxPriceRange.value =
        elements.maxPriceRange.max;

    updatePriceLabels();
    updateActiveFilters();

    productCurrentPage = 1;

    filteredProducts = [...products];

    renderProducts();
}

function showEmptyState() {
    elements.productsGrid.innerHTML = "";
    elements.emptyState.classList.remove("d-none");
    elements.productCount.textContent = "0 sản phẩm";
}

function scrollToProducts() {
    const section =
        document.querySelector(".products-section");

    if (!section) {
        return;
    }

    const offset = 80;

    window.scrollTo({
        top: section.offsetTop - offset,
        behavior: "smooth"
    });
}

function getProductImage(imageName) {
    if (!imageName) {
        return "https://placehold.co/600x600/eee8dc/333?text=Interior";
    }

    if (
        imageName.startsWith("http://") ||
        imageName.startsWith("https://")
    ) {
        return imageName;
    }

    return IMAGE_PATH + imageName;
}

function createStars(rating) {
    const roundedRating =
        Math.round(Number(rating));

    let stars = "";

    for (let i = 1; i <= 5; i++) {
        stars += i <= roundedRating
            ? "★"
            : "☆";
    }

    return stars;
}

function formatCurrency(value) {
    return new Intl.NumberFormat(
        "vi-VN"
    ).format(Number(value)) + " ₫";
}

function formatNumber(value) {
    return new Intl.NumberFormat(
        "vi-VN"
    ).format(Number(value));
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}