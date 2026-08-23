let cart = [];
let currentUser = {};
let shippingFee = 0;
let orderModal;
let resultCloseAction = "cart";

const CART_KEY = "cart";
const USER_KEY = "currentUser";
const ORDERS_KEY = "orders";
const FREE_SHIPPING_LIMIT = 5000000;
const STANDARD_SHIPPING_FEE = 50000;

const cartProductList = document.getElementById("cartProductList");
const cartContent = document.getElementById("cartContent");
const cartEmpty = document.getElementById("cartEmpty");
const cartItemCount = document.getElementById("cartItemCount");
const subtotalElement = document.getElementById("subtotal");
const shippingFeeElement = document.getElementById("shippingFee");
const totalPriceElement = document.getElementById("totalPrice");
const checkoutSection = document.getElementById("checkoutSection");
const checkoutProducts = document.getElementById("checkoutProducts");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutShipping = document.getElementById("checkoutShipping");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");
const orderResultModal = document.getElementById("orderResultModal");
const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const orderCode = document.getElementById("orderCode");
const resultCloseBtn = document.getElementById("resultCloseBtn");

document.addEventListener("DOMContentLoaded", init);

function init() {
    orderModal = new bootstrap.Modal(orderResultModal);
    loadUser();
    loadCart();
    bindEvents();
    renderCart();
}

function loadUser() {
    try {
        currentUser = JSON.parse(localStorage.getItem(USER_KEY)) || {};
    } catch (error) {
        currentUser = {};
    }

    document.getElementById("username").value = currentUser.username || "";
    document.getElementById("email").value = currentUser.email || "";
    document.getElementById("phone").value = currentUser.phone || "";
}

function loadCart() {
    try {
        const savedCart = JSON.parse(localStorage.getItem(CART_KEY));
        cart = Array.isArray(savedCart) ? savedCart : [];
    } catch (error) {
        cart = [];
    }
}

function bindEvents() {
    document.getElementById("clearCartBtn").addEventListener("click", clearCart);
    document.getElementById("checkoutBtn").addEventListener("click", openCheckout);
    document.getElementById("backToCartBtn").addEventListener("click", closeCheckout);
    document.getElementById("modalAddCartBtn")?.addEventListener("click", addModalProductToCart);
    checkoutForm.addEventListener("submit", submitOrder);
    resultCloseBtn.addEventListener("click", handleResultClose);
    document.querySelectorAll('input[name="paymentMethod"]').forEach(input => {
        input.addEventListener("change", changePaymentMethod);
    });
    document.getElementById("cardNumber").addEventListener("input", formatCardNumber);
    document.getElementById("expiryDate").addEventListener("input", formatExpiryDate);
    document.getElementById("cvv").addEventListener("input", formatCVV);
}

function renderCart() {
    if (cart.length === 0) {
        cartContent.classList.add("d-none");
        cartEmpty.classList.remove("d-none");
        checkoutSection.classList.add("d-none");
        return;
    }

    cartContent.classList.remove("d-none");
    cartEmpty.classList.add("d-none");

    cartProductList.innerHTML = cart.map((item, index) => {
        return createCartProduct(item, index);
    }).join("");

    bindCartProductEvents();
    updateSummary();
}

function createCartProduct(item, index) {
    const price = Number(item.finalPrice || item.price || 0);
    const quantity = Number(item.quantity || 1);
    const total = price * quantity;
    const image = getProductImage(item.images);

    return `
        <article class="cart-product" data-index="${index}">
            <div class="cart-product-image">
                <img src="${image}" alt="${escapeHtml(item.name)}" onerror="this.src='https://placehold.co/300x300/eee8dc/333?text=Interior';">
            </div>
            <div class="cart-product-info">
                <span class="cart-product-brand">${escapeHtml(item.brand || "LUXURY INTERIOR")}</span>
                <h3 class="cart-product-name">${escapeHtml(item.name)}</h3>
                <span class="cart-product-category">${escapeHtml(item.category || "")}</span>
                <div class="cart-product-price">${formatCurrency(total)} <small>/${quantity} sản phẩm</small></div>
            </div>
            <div class="cart-product-controls">
                <div class="quantity-control">
                    <button type="button" class="quantity-btn decrease-btn" data-index="${index}">
                        <i class="bi bi-dash"></i>
                    </button>
                    <span class="quantity-value">${quantity}</span>
                    <button type="button" class="quantity-btn increase-btn" data-index="${index}">
                        <i class="bi bi-plus"></i>
                    </button>
                </div>
                <button type="button" class="delete-product-btn" data-index="${index}">
                    <i class="bi bi-trash3"></i>
                    Xóa
                </button>
            </div>
        </article>
    `;
}

function bindCartProductEvents() {
    document.querySelectorAll(".decrease-btn").forEach(button => {
        button.addEventListener("click", () => changeQuantity(button.dataset.index, -1));
    });

    document.querySelectorAll(".increase-btn").forEach(button => {
        button.addEventListener("click", () => changeQuantity(button.dataset.index, 1));
    });

    document.querySelectorAll(".delete-product-btn").forEach(button => {
        button.addEventListener("click", () => deleteProduct(button.dataset.index));
    });
}

function changeQuantity(index, amount) {
    const product = cart[index];

    if (!product) {
        return;
    }

    const newQuantity = Number(product.quantity || 1) + amount;

    if (newQuantity < 1) {
        deleteProduct(index);
        return;
    }

    product.quantity = newQuantity;
    saveCart();
    renderCart();
    renderCheckoutProducts();
}

function deleteProduct(index) {
    const product = cart[index];

    if (!product) {
        return;
    }

    const confirmed = confirm(
        `Bạn có chắc muốn xóa "${product.name}" khỏi giỏ hàng?`
    );

    if (!confirmed) {
        return;
    }

    cart.splice(index, 1);
    saveCart();
    renderCart();
}

function clearCart() {
    if (cart.length === 0) {
        return;
    }

    const confirmed = confirm(
        "Bạn có chắc muốn xóa toàn bộ sản phẩm khỏi giỏ hàng?"
    );

    if (!confirmed) {
        return;
    }

    cart = [];
    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateSummary() {
    const subtotal = calculateSubtotal();

    shippingFee = subtotal >= FREE_SHIPPING_LIMIT ? 0 : STANDARD_SHIPPING_FEE;

    const total = subtotal + shippingFee;
    const totalItems = cart.reduce((sum, item) => {
        return sum + Number(item.quantity || 1);
    }, 0);

    cartItemCount.textContent = `${formatNumber(totalItems)} sản phẩm`;
    subtotalElement.textContent = formatCurrency(subtotal);
    shippingFeeElement.textContent = shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee);
    totalPriceElement.textContent = formatCurrency(total);
}

function calculateSubtotal() {
    return cart.reduce((sum, item) => {
        const price = Number(item.finalPrice || item.price || 0);
        const quantity = Number(item.quantity || 1);
        return sum + price * quantity;
    }, 0);
}

function openCheckout() {
    if (cart.length === 0) {
        showResult(
            false,
            "Không thể thanh toán",
            "Giỏ hàng của bạn đang trống.",
            ""
        );
        return;
    }

    if (!currentUser.email) {
        showResult(
            false,
            "Chưa đăng nhập",
            "Vui lòng đăng nhập trước khi tiến hành thanh toán.",
            ""
        );
        return;
    }

    checkoutSection.classList.remove("d-none");
    renderCheckoutProducts();

    setTimeout(() => {
        checkoutSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 100);
}

function closeCheckout() {
    checkoutSection.classList.add("d-none");

    document.querySelector(".cart-section").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function renderCheckoutProducts() {
    const subtotal = calculateSubtotal();

    shippingFee = subtotal >= FREE_SHIPPING_LIMIT ? 0 : STANDARD_SHIPPING_FEE;

    checkoutProducts.innerHTML = cart.map(item => {
        const price = Number(item.finalPrice || item.price || 0);
        const quantity = Number(item.quantity || 1);

        return `
            <div class="checkout-product">
                <div class="checkout-product-image">
                    <img src="${getProductImage(item.images)}" alt="${escapeHtml(item.name)}" onerror="this.src='https://placehold.co/100x100/eee8dc/333?text=Interior';">
                </div>
                <div class="checkout-product-info">
                    <div class="checkout-product-name">${escapeHtml(item.name)}</div>
                    <div class="checkout-product-quantity">Số lượng: ${quantity}</div>
                </div>
                <div class="checkout-product-price">${formatCurrency(price * quantity)}</div>
            </div>
        `;
    }).join("");

    checkoutSubtotal.textContent = formatCurrency(subtotal);
    checkoutShipping.textContent = shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee);
    checkoutTotal.textContent = formatCurrency(subtotal + shippingFee);
}

function changePaymentMethod(event) {
    const method = event.target.value;
    const codForm = document.getElementById("codForm");
    const cardForm = document.getElementById("cardForm");

    if (method === "COD") {
        codForm.classList.remove("d-none");
        cardForm.classList.add("d-none");
        return;
    }

    codForm.classList.add("d-none");
    cardForm.classList.remove("d-none");
}

function submitOrder(event) {
    event.preventDefault();

    if (cart.length === 0) {
        showResult(
            false,
            "Giỏ hàng trống",
            "Không thể tạo đơn hàng khi giỏ hàng không có sản phẩm.",
            ""
        );
        return;
    }

    if (!currentUser.email) {
        showResult(
            false,
            "Thiếu thông tin tài khoản",
            "Không tìm thấy email người dùng. Vui lòng đăng nhập lại.",
            ""
        );
        return;
    }

    clearValidation();

    const method = document.querySelector('input[name="paymentMethod"]:checked').value;
    const validation = validateCheckout(method);

    if (!validation.valid) {
        showResult(
            false,
            "Thông tin chưa hợp lệ",
            validation.message,
            ""
        );
        return;
    }

    const order = createOrder(method);

    saveOrder(order);

    cart = [];
    saveCart();

    showResult(
        true,
        "Đặt hàng thành công",
        "Cảm ơn bạn đã mua sắm tại Luxury Interior. Đơn hàng đang được xử lý.",
        order.orderCode
    );

    checkoutForm.reset();
    document.querySelector('input[name="paymentMethod"][value="COD"]').checked = true;
    changePaymentMethod({
        target: {
            value: "COD"
        }
    });

    renderCart();
}

function validateCheckout(method) {
    if (!currentUser.username || !currentUser.email || !currentUser.phone) {
        return {
            valid: false,
            message: "Thông tin tài khoản chưa đầy đủ. Vui lòng cập nhật username, email và số điện thoại."
        };
    }

    if (method === "COD") {
        const address = document.getElementById("address").value.trim();

        if (address.length < 10) {
            setError(
                "addressError",
                "Địa chỉ nhận hàng phải có ít nhất 10 ký tự."
            );

            return {
                valid: false,
                message: "Vui lòng kiểm tra địa chỉ nhận hàng."
            };
        }

        return {
            valid: true,
            message: ""
        };
    }

    return validateCard();
}

function validateCard() {
    const cardNumber = document.getElementById("cardNumber").value.replace(/\s/g, "");
    const cardName = document.getElementById("cardName").value.trim();
    const expiryDate = document.getElementById("expiryDate").value.trim();
    const cvv = document.getElementById("cvv").value.trim();
    let valid = true;

    if (!/^\d{16}$/.test(cardNumber)) {
        setError(
            "cardNumberError",
            "Số thẻ phải gồm 16 chữ số."
        );
        valid = false;
    }

    if (!/^[A-Za-zÀ-ỹ\s]{3,}$/.test(cardName)) {
        setError(
            "cardNameError",
            "Vui lòng nhập tên chủ thẻ hợp lệ."
        );
        valid = false;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        setError(
            "expiryDateError",
            "Ngày hết hạn phải có dạng MM/YY."
        );
        valid = false;
    } else if (isExpired(expiryDate)) {
        setError(
            "expiryDateError",
            "Thẻ đã hết hạn."
        );
        valid = false;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
        setError(
            "cvvError",
            "CVV phải gồm 3 hoặc 4 chữ số."
        );
        valid = false;
    }

    return {
        valid,
        message: valid ? "" : "Vui lòng kiểm tra lại thông tin thẻ."
    };
}

function isExpired(expiryDate) {
    const [month, year] = expiryDate.split("/").map(Number);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;

    return year < currentYear || year === currentYear && month < currentMonth;
}

function createOrder(paymentMethod) {
    const subtotal = calculateSubtotal();
    const total = subtotal + shippingFee;
    const address = document.getElementById("address").value.trim();
    const note = document.getElementById("note").value.trim();

    return {
        orderCode: generateOrderCode(),
        user: {
            email: currentUser.email,
            username: currentUser.username,
            phone: currentUser.phone,
            address: address,
            note: note
        },
        payment: {
            method: paymentMethod,
            status: "Pending"
        },
        products: cart.map(item => ({
            ...item,
            quantity: Number(item.quantity || 1)
        })),
        subtotal: subtotal,
        shippingFee: shippingFee,
        total: total,
        currency: "VND",
        createdAt: new Date().toISOString(),
        status: "Pending"
    };
}

function saveOrder(order) {
    let orders = [];

    try {
        const savedOrders = JSON.parse(localStorage.getItem(ORDERS_KEY));
        orders = Array.isArray(savedOrders) ? savedOrders : [];
    } catch (error) {
        orders = [];
    }

    orders.unshift(order);

    localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(orders)
    );
}

function generateOrderCode() {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(100 + Math.random() * 900);

    return `LUX-${timestamp}-${random}`;
}

function showResult(success, title, message, code) {
    resultIcon.className = success
        ? "result-icon success"
        : "result-icon error";

    resultIcon.innerHTML = success
        ? '<i class="bi bi-check-lg"></i>'
        : '<i class="bi bi-x-lg"></i>';

    resultTitle.textContent = title;
    resultMessage.textContent = message;
    orderCode.textContent = code ? `Mã đơn hàng: ${code}` : "";

    resultCloseAction = success ? "products" : "cart";

    orderModal.show();
}

function handleResultClose() {
    if (resultCloseAction === "products") {
        window.location.href = "./products.html";
        return;
    }

    orderModal.hide();
}

function setError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
}

function clearValidation() {
    document.querySelectorAll(".invalid-message").forEach(element => {
        element.textContent = "";
    });
}

function formatCardNumber(event) {
    const value = event.target.value
        .replace(/\D/g, "")
        .substring(0, 16);

    event.target.value = value.replace(
        /(\d{4})(?=\d)/g,
        "$1 "
    );
}

function formatExpiryDate(event) {
    const value = event.target.value
        .replace(/\D/g, "")
        .substring(0, 4);

    event.target.value = value.length > 2
        ? `${value.substring(0, 2)}/${value.substring(2)}`
        : value;
}

function formatCVV(event) {
    event.target.value = event.target.value
        .replace(/\D/g, "")
        .substring(0, 4);
}

function getProductImage(imageName) {
    if (!imageName) {
        return "https://placehold.co/300x300/eee8dc/333?text=Interior";
    }

    if (
        imageName.startsWith("http://") ||
        imageName.startsWith("https://")
    ) {
        return imageName;
    }

    return `./assets/images/${imageName}`;
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