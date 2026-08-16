// ======================== HEADER ==========================
const header = document.getElementById("main-header");

const menuItems = [
    { name: "Home", path: "index.html", icon: "bi-house" },
    { name: "Products", path: "products.html", icon: "bi-grid" },
    { name: "Services", path: "services.html", icon: "bi-stars" },
    { name: "Carts", path: "carts.html", icon: "bi-bag" },
    { name: "Orders", path: "orders.html", icon: "bi-receipt" },
    { name: "Account", path: "account.html", icon: "bi-person" }
];

const currentPage = window.location.pathname.split("/").pop() || "index.html";

const desktopMenu = menuItems.map(item => `
    <a
        href="${item.path}"
        class="dk-nav-link ${currentPage === item.path ? "active" : ""}"
    >
        ${item.name}
    </a>
`).join("");

const mobileMenu = menuItems.map(item => `
    <a
        href="${item.path}"
        class="dk-mobile-link"
    >
        <i class="bi ${item.icon}"></i>
        <span>${item.name}</span>
    </a>
`).join("");

header.innerHTML = `
    <nav class="dk-navbar">
        <div class="dk-navbar-container">

            <a href="index.html" class="dk-brand">
                <img
                    src="https://png.pngtree.com/template/20190928/ourmid/pngtree-gold-furniture-lamp-chair-interior-logo-design-template-inspirat-image_312127.jpg"
                    alt="DK Furniture Logo"
                    class="dk-logo"
                >

                <span class="dk-brand-text">
                    <span class="dk-brand-name">
                        DK Furniture
                    </span>

                    <span class="dk-brand-subtitle">
                        Luxury Interior
                    </span>
                </span>
            </a>

            <div class="dk-navigation">
                ${desktopMenu}
            </div>

            <div class="dk-actions">

                <button
                    type="button"
                    class="dk-action-btn dk-cart-btn"
                    title="Shopping Cart"
                    onclick="window.location.href='carts.html'"
                >
                    <i class="bi bi-bag"></i>
                    <span class="dk-cart-badge">0</span>
                </button>

                <button
                    type="button"
                    class="dk-action-btn dk-theme-toggle"
                    id="theme-toggle"
                    title="Change theme"
                >
                    <i class="bi bi-moon-stars-fill"></i>
                </button>

                <button
                    type="button"
                    class="dk-mobile-toggle"
                    id="mobile-toggle"
                    title="Menu"
                    aria-label="Open menu"
                >
                    <i class="bi bi-list"></i>
                </button>

            </div>
        </div>

        <div class="dk-mobile-menu" id="mobile-menu">
            ${mobileMenu}
        </div>

        <div class="dk-gold-line"></div>
    </nav>
`;


/* =========================================================
   THEME
========================================================= */

const themeToggle = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("darkmode");
}

const updateThemeIcon = () => {
    const icon = themeToggle.querySelector("i");
    const isDarkMode = document.body.classList.contains("darkmode");

    icon.className = isDarkMode
        ? "bi bi-sun-fill"
        : "bi bi-moon-stars-fill";

    themeToggle.title = isDarkMode
        ? "Switch to Light Mode"
        : "Switch to Dark Mode";
};

updateThemeIcon();

themeToggle.addEventListener("click", () => {
    const isDarkMode = document.body.classList.toggle("darkmode");

    localStorage.setItem(
        "theme",
        isDarkMode ? "dark" : "light"
    );

    updateThemeIcon();
});


/* =========================================================
   MOBILE MENU
========================================================= */

const mobileToggle = document.getElementById("mobile-toggle");
const mobileMenuElement = document.getElementById("mobile-menu");

mobileToggle.addEventListener("click", () => {
    mobileMenuElement.classList.toggle("show");

    const icon = mobileToggle.querySelector("i");

    icon.className = mobileMenuElement.classList.contains("show")
        ? "bi bi-x-lg"
        : "bi bi-list";
});


/* =========================================================
   CLOSE MOBILE MENU
========================================================= */

document.addEventListener("click", event => {
    const clickedInsideMenu = mobileMenuElement.contains(event.target);
    const clickedToggle = mobileToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
        mobileMenuElement.classList.remove("show");

        mobileToggle.querySelector("i").className = "bi bi-list";
    }
});


/* =========================================================
   CLOSE MENU AFTER NAVIGATION
========================================================= */

document.querySelectorAll(".dk-mobile-link").forEach(link => {
    link.addEventListener("click", () => {
        mobileMenuElement.classList.remove("show");

        mobileToggle.querySelector("i").className = "bi bi-list";
    });
});

// ======================== FOOTER ==========================
const footer = document.getElementById("main-footer");

footer.innerHTML = `
    <div class="dk-footer">
        <div class="dk-footer-top">
            <div class="dk-footer-container">
                <div class="row g-4">

                    <div class="col-lg-4 col-md-6">
                        <div class="dk-footer-brand">
                            <div class="dk-footer-logo-wrapper">
                                <img
                                    src="https://png.pngtree.com/template/20190928/ourmid/pngtree-gold-furniture-lamp-chair-interior-logo-design-template-inspirat-image_312127.jpg"
                                    alt="DK Furniture Logo"
                                    class="dk-footer-logo"
                                >
                                <div>
                                    <span class="dk-footer-brand-name">
                                        DK Furniture
                                    </span>
                                    <span class="dk-footer-brand-subtitle">
                                        Luxury Interior
                                    </span>
                                </div>
                            </div>

                            <p class="dk-footer-description">
                                Kiến tạo không gian sống tinh tế với những sản phẩm
                                nội thất cao cấp, hiện đại và mang đậm dấu ấn riêng
                                cho từng ngôi nhà.
                            </p>

                            <div class="dk-footer-social">
                                <a href="#" class="dk-social-link" title="Facebook">
                                    <i class="bi bi-facebook"></i>
                                </a>
                                <a href="#" class="dk-social-link" title="Instagram">
                                    <i class="bi bi-instagram"></i>
                                </a>
                                <a href="#" class="dk-social-link" title="Pinterest">
                                    <i class="bi bi-pinterest"></i>
                                </a>
                                <a href="#" class="dk-social-link" title="Youtube">
                                    <i class="bi bi-youtube"></i>
                                </a>
                                <a href="#" class="dk-social-link" title="TikTok">
                                    <i class="bi bi-tiktok"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-2 col-md-6">
                        <div class="dk-footer-column">
                            <h5 class="dk-footer-title">
                                Explore
                            </h5>

                            <ul class="dk-footer-links">
                                <li>
                                    <a href="index.html" class="dk-footer-link">
                                        <i class="bi bi-chevron-right"></i>
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a href="products.html" class="dk-footer-link">
                                        <i class="bi bi-chevron-right"></i>
                                        Products
                                    </a>
                                </li>
                                <li>
                                    <a href="services.html" class="dk-footer-link">
                                        <i class="bi bi-chevron-right"></i>
                                        Services
                                    </a>
                                </li>
                                <li>
                                    <a href="carts.html" class="dk-footer-link">
                                        <i class="bi bi-chevron-right"></i>
                                        Shopping Cart
                                    </a>
                                </li>
                                <li>
                                    <a href="orders.html" class="dk-footer-link">
                                        <i class="bi bi-chevron-right"></i>
                                        My Orders
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="col-lg-2 col-md-6">
                        <div class="dk-footer-column">
                            <h5 class="dk-footer-title">
                                Categories
                            </h5>

                            <ul class="dk-footer-links">
                                <li>
                                    <a href="products.html" class="dk-footer-link">
                                        <i class="bi bi-chevron-right"></i>
                                        Living Room
                                    </a>
                                </li>
                                <li>
                                    <a href="products.html" class="dk-footer-link">
                                        <i class="bi bi-chevron-right"></i>
                                        Bedroom
                                    </a>
                                </li>
                                <li>
                                    <a href="products.html" class="dk-footer-link">
                                        <i class="bi bi-chevron-right"></i>
                                        Dining Room
                                    </a>
                                </li>
                                <li>
                                    <a href="products.html" class="dk-footer-link">
                                        <i class="bi bi-chevron-right"></i>
                                        Office
                                    </a>
                                </li>
                                <li>
                                    <a href="products.html" class="dk-footer-link">
                                        <i class="bi bi-chevron-right"></i>
                                        Decoration
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="col-lg-4 col-md-6">
                        <div class="dk-footer-column">
                            <h5 class="dk-footer-title">
                                Contact Us
                            </h5>

                            <div class="dk-contact-item">
                                <div class="dk-contact-icon">
                                    <i class="bi bi-geo-alt"></i>
                                </div>
                                <div class="dk-contact-content">
                                    <span class="dk-contact-label">
                                        Showroom
                                    </span>
                                    <a href="#" class="dk-contact-value">
                                        128 Luxury Avenue, District 1, Ho Chi Minh City
                                    </a>
                                </div>
                            </div>

                            <div class="dk-contact-item">
                                <div class="dk-contact-icon">
                                    <i class="bi bi-telephone"></i>
                                </div>
                                <div class="dk-contact-content">
                                    <span class="dk-contact-label">
                                        Hotline
                                    </span>
                                    <a href="tel:19001234" class="dk-contact-value">
                                        1900 1234
                                    </a>
                                </div>
                            </div>

                            <div class="dk-contact-item">
                                <div class="dk-contact-icon">
                                    <i class="bi bi-envelope"></i>
                                </div>
                                <div class="dk-contact-content">
                                    <span class="dk-contact-label">
                                        Email
                                    </span>
                                    <a href="mailto:contact@dkfurniture.vn" class="dk-contact-value">
                                        contact@dkfurniture.vn
                                    </a>
                                </div>
                            </div>

                            <div class="dk-contact-item">
                                <div class="dk-contact-icon">
                                    <i class="bi bi-clock"></i>
                                </div>
                                <div class="dk-contact-content">
                                    <span class="dk-contact-label">
                                        Opening Hours
                                    </span>
                                    <span class="dk-contact-value">
                                        Mon - Sun: 08:30 - 21:00
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="dk-newsletter">
                    <div class="dk-newsletter-content">
                        <div>
                            <h4 class="dk-newsletter-heading">
                                Discover Timeless Design
                            </h4>
                            <p class="dk-newsletter-text">
                                Đăng ký để nhận thông tin về bộ sưu tập mới và ưu đãi đặc biệt.
                            </p>
                        </div>

                        <form class="dk-newsletter-form" id="newsletter-form">
                            <input
                                type="email"
                                id="newsletter-email"
                                class="dk-newsletter-input"
                                placeholder="Nhập email của bạn..."
                                required
                            >
                            <button
                                type="submit"
                                class="dk-newsletter-btn"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="dk-footer-bottom">
            <div class="dk-footer-bottom-container">
                <p class="dk-copyright">
                    © 2026 <strong>DK Furniture</strong>.
                    All Rights Reserved.
                </p>

                <div class="dk-footer-legal">
                    <a href="#" class="dk-legal-link">
                        Privacy Policy
                    </a>
                    <a href="#" class="dk-legal-link">
                        Terms & Conditions
                    </a>
                    <a href="#" class="dk-legal-link">
                        Shipping Policy
                    </a>
                </div>

                <div class="dk-payment-methods">
                    <span class="dk-payment-icon" title="Visa">
                        <i class="bi bi-credit-card"></i>
                    </span>
                    <span class="dk-payment-icon" title="Mastercard">
                        <i class="bi bi-credit-card-2-front"></i>
                    </span>
                    <span class="dk-payment-icon" title="Bank Transfer">
                        <i class="bi bi-bank"></i>
                    </span>
                    <span class="dk-payment-icon" title="Cash">
                        <i class="bi bi-cash-stack"></i>
                    </span>
                </div>
            </div>
        </div>
    </div>

    <button
        type="button"
        class="dk-back-top"
        id="dk-back-top"
        title="Back to top"
        aria-label="Back to top"
    >
        <i class="bi bi-arrow-up"></i>
    </button>
`;

const backTopButton = document.getElementById("dk-back-top");

window.addEventListener("scroll", () => {
    backTopButton.classList.toggle("show", window.scrollY > 350);
});

backTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

const newsletterForm = document.getElementById("newsletter-form");

newsletterForm.addEventListener("submit", event => {
    event.preventDefault();
    const emailInput = document.getElementById("newsletter-email");
    const email = emailInput.value.trim();
    if (!email) {
        return;
    }
    alert(`Cảm ơn bạn đã đăng ký với DK Furniture!`);
    emailInput.value = "";
});