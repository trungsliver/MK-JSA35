const PRODUCTS_URL = "./data/products.json";
const IMAGE_PATH = "./assets/images/";
let products = [];
let selectedProduct = null;
let toastTimer = null;

const elements = {
    bestSellingGrid: document.getElementById("bestSellingGrid"),
    newProductsGrid: document.getElementById("newProductsGrid"),
    discountProductsGrid: document.getElementById("discountProductsGrid"),
    modalProductImage: document.getElementById("modalProductImage"),
    modalDiscount: document.getElementById("modalDiscount"),
    modalBrand: document.getElementById("modalBrand"),
    modalProductName: document.getElementById("modalProductName"),
    modalStars: document.getElementById("modalStars"),
    modalRating: document.getElementById("modalRating"),
    modalSold: document.getElementById("modalSold"),
    modalFinalPrice: document.getElementById("modalFinalPrice"),
    modalOriginalPrice: document.getElementById("modalOriginalPrice"),
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
        renderHomeProducts();
    } catch (error) {
        console.error("Product loading error:", error);
        showLoadError();
    }
}

function renderHomeProducts() {
    const bestSelling = [...products]
        .sort((a, b) => Number(b.sold) - Number(a.sold))
        .slice(0, 4);

    const newProducts = [...products]
        .slice()
        .reverse()
        .slice(0, 4);

    const discountedProducts = [...products]
        .sort((a, b) => Number(b.discount) - Number(a.discount))
        .slice(0, 4);

    renderProducts(
        elements.bestSellingGrid,
        bestSelling
    );

    renderProducts(
        elements.newProductsGrid,
        newProducts
    );

    renderProducts(
        elements.discountProductsGrid,
        discountedProducts
    );
}

function renderProducts(container, productList) {
    container.innerHTML = "";

    productList.forEach((product, index) => {
        const card = createProductCard(product, index);
        container.insertAdjacentHTML("beforeend", card);
    });

    bindProductEvents(container);
}

function createProductCard(product, index) {
    const price = Number(product.price);
    const finalPrice = Number(product.finalPrice);
    const discount = Number(product.discount);
    const rating = Number(product.rating);
    const image = getProductImage(product.images);

    return `
        <div class="col-6 col-md-4 col-lg-3 product-card-wrapper" style="animation-delay:${index * 0.08}s">
            <article class="product-card">

                <div class="product-image-wrapper">

                    <img
                        src="${image}"
                        alt="${escapeHtml(product.name)}"
                        class="product-image"
                        loading="lazy"
                        onerror="this.src='https://placehold.co/600x600/eee8dc/333?text=Interior';">

                    <div class="product-badges">
                        ${discount > 0 ? `
                            <span class="product-badge discount">
                                -${discount}%
                            </span>
                        ` : ""}
                    </div>

                    <div class="product-overlay">
                        <button type="button" class="quick-view-btn" data-detail="${product.id}">
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
                        <span class="stars">${createStars(rating)}</span>
                        <span class="rating-number">${rating.toFixed(1)}</span>
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

function bindProductEvents(container) {
    container.querySelectorAll("[data-detail]").forEach(button => {
        button.addEventListener("click", () => {
            openProductDetail(button.dataset.detail);
        });
    });

    container.querySelectorAll("[data-cart]").forEach(button => {
        button.addEventListener("click", () => {
            addToCart(button.dataset.cart);
        });
    });
}

function openProductDetail(productId) {
    const product = products.find(
        item => String(item.id) === String(productId)
    );

    if (!product) {
        return;
    }

    selectedProduct = product;

    const price = Number(product.price);
    const finalPrice = Number(product.finalPrice);
    const discount = Number(product.discount);
    const rating = Number(product.rating);
    const stock = Number(product.stock);

    elements.modalProductImage.src =
        getProductImage(product.images);

    elements.modalProductImage.alt =
        product.name;

    elements.modalBrand.textContent =
        product.brand;

    elements.modalProductName.textContent =
        product.name;

    elements.modalStars.innerHTML =
        createStars(rating);

    elements.modalRating.textContent =
        rating.toFixed(1);

    elements.modalSold.textContent =
        formatNumber(product.sold);

    elements.modalFinalPrice.textContent =
        formatCurrency(finalPrice);

    elements.modalOriginalPrice.textContent =
        price > finalPrice
            ? formatCurrency(price)
            : "";

    elements.modalDiscountText.textContent =
        discount > 0
            ? `-${discount}%`
            : "";

    elements.modalDiscount.textContent =
        discount > 0
            ? `GIẢM ${discount}%`
            : "";

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

    elements.modalAddCartBtn.disabled =
        stock <= 0;

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

    addToCart(selectedProduct.id);
}

function addToCart(productId) {
    const product = products.find(
        item => String(item.id) === String(productId)
    );

    if (!product || Number(product.stock) <= 0) {
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

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

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

    clearTimeout(toastTimer);

    toastTimer = setTimeout(
        hideToast,
        3000
    );
}

function hideToast() {
    elements.cartToast.classList.remove("show");
}

function setupEvents() {
    elements.modalAddCartBtn.addEventListener(
        "click",
        addModalProductToCart
    );

    elements.closeToastBtn.addEventListener(
        "click",
        hideToast
    );
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
        stars += i <= roundedRating ? "★" : "☆";
    }

    return stars;
}

function formatCurrency(value) {
    return new Intl.NumberFormat("vi-VN")
        .format(Number(value)) + " ₫";
}

function formatNumber(value) {
    return new Intl.NumberFormat("vi-VN")
        .format(Number(value));
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showLoadError() {
    elements.bestSellingGrid.innerHTML = createErrorCard();
    elements.newProductsGrid.innerHTML = createErrorCard();
    elements.discountProductsGrid.innerHTML = createErrorCard();
}

function createErrorCard() {
    return `
        <div class="col-12">
            <div class="alert alert-warning">
                Không thể tải dữ liệu sản phẩm.
                Vui lòng kiểm tra file ./data/products.json.
            </div>
        </div>
    `;
}