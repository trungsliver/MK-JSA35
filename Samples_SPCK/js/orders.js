const ORDERS_KEY = "orders";
const USER_KEY = "currentUser";
let orders = [];
let currentUser = {};
let currentFilter = "ALL";
let selectedOrderIndex = -1;
let orderDetailModal;
let cancelOrderModal;
let orderToast;

document.addEventListener("DOMContentLoaded", init);

function init() {
    orderDetailModal = new bootstrap.Modal(document.getElementById("orderDetailModal"));
    cancelOrderModal = new bootstrap.Modal(document.getElementById("cancelOrderModal"));
    orderToast = new bootstrap.Toast(document.getElementById("orderToast"), { delay: 3000 });
    loadUser();
    loadOrders();
    bindEvents();
    renderOrders();
}

function loadUser() {
    try {
        currentUser = JSON.parse(localStorage.getItem(USER_KEY)) || {};
    } catch (error) {
        currentUser = {};
    }
}

function loadOrders() {
    try {
        const savedOrders = JSON.parse(localStorage.getItem(ORDERS_KEY));
        orders = Array.isArray(savedOrders) ? savedOrders : [];
    } catch (error) {
        orders = [];
    }
}

function bindEvents() {
    document.querySelectorAll(".filter-btn").forEach(button => {
        button.addEventListener("click", () => {
            currentFilter = button.dataset.status;
            document.querySelectorAll(".filter-btn").forEach(item => item.classList.remove("active"));
            button.classList.add("active");
            renderOrders();
        });
    });
    document.getElementById("confirmCancelBtn").addEventListener("click", cancelSelectedOrder);
}

function getUserOrders() {
    if (!currentUser.email) {
        return [];
    }
    return orders.filter(order => order.user && order.user.email === currentUser.email);
}

function getFilteredOrders() {
    const userOrders = getUserOrders();
    if (currentFilter === "ALL") {
        return userOrders;
    }
    return userOrders.filter(order => normalizeStatus(order.status) === currentFilter);
}

function renderOrders() {
    const userOrders = getUserOrders();
    const filteredOrders = getFilteredOrders();
    const ordersList = document.getElementById("ordersList");
    const emptyOrders = document.getElementById("emptyOrders");
    const noFilterResult = document.getElementById("noFilterResult");
    const orderCount = document.getElementById("orderCount");

    orderCount.textContent = `${formatNumber(userOrders.length)} đơn hàng`;

    if (userOrders.length === 0) {
        ordersList.innerHTML = "";
        emptyOrders.classList.remove("d-none");
        noFilterResult.classList.add("d-none");
        return;
    }

    emptyOrders.classList.add("d-none");

    if (filteredOrders.length === 0) {
        ordersList.innerHTML = "";
        noFilterResult.classList.remove("d-none");
        return;
    }

    noFilterResult.classList.add("d-none");
    ordersList.innerHTML = filteredOrders.map(order => createOrderCard(order)).join("");
    bindOrderActions();
}

function createOrderCard(order) {
    const products = Array.isArray(order.products) ? order.products : [];
    const status = normalizeStatus(order.status);
    const statusInfo = getStatusInfo(status);
    const visibleProducts = products.slice(0, 3);
    const remainingProducts = products.length - visibleProducts.length;

    return `
        <article class="order-card">
            <div class="order-card-header">
                <div class="order-code-wrapper">
                    <div class="order-icon">
                        <i class="bi bi-box-seam"></i>
                    </div>
                    <div class="order-code-info">
                        <span class="order-code-label">MÃ ĐƠN HÀNG</span>
                        <span class="order-code">${escapeHtml(order.orderCode || "N/A")}</span>
                    </div>
                </div>
                <span class="order-status ${statusInfo.className}">
                    ${statusInfo.label}
                </span>
            </div>
            <div class="order-card-body">
                <div class="order-products">
                    ${visibleProducts.map(product => createOrderProduct(product)).join("")}
                </div>
                ${remainingProducts > 0 ? `<div class="more-products">+ ${remainingProducts} sản phẩm khác</div>` : ""}
            </div>
            <div class="order-card-footer">
                <div class="order-date">
                    <i class="bi bi-calendar3"></i>
                    ${formatDate(order.createdAt)}
                </div>
                <div class="order-total">
                    <span>Tổng thanh toán</span>
                    <strong>${formatCurrency(order.total || 0)}</strong>
                </div>
                <div class="order-actions">
                    <button type="button" class="order-detail-btn" data-code="${escapeHtml(order.orderCode || "")}">
                        <i class="bi bi-eye"></i>
                        Chi tiết
                    </button>
                    ${status === "Pending" ? `
                        <button type="button" class="cancel-order-btn" data-code="${escapeHtml(order.orderCode || "")}">
                            <i class="bi bi-x-circle"></i>
                            Hủy đơn
                        </button>
                    ` : ""}
                </div>
            </div>
        </article>
    `;
}

function createOrderProduct(product) {
    const quantity = Number(product.quantity || 1);
    const price = Number(product.finalPrice || product.price || 0);

    return `
        <div class="order-product">
            <div class="order-product-image">
                <img src="${getProductImage(product.images)}" alt="${escapeHtml(product.name || "Product")}" onerror="this.src='https://placehold.co/300x300/eee8dc/333?text=Interior';">
            </div>
            <div class="order-product-info">
                <div class="order-product-name">${escapeHtml(product.name || "Sản phẩm")}</div>
                <div class="order-product-meta">
                    <span>Thương hiệu: ${escapeHtml(product.brand || "N/A")}</span>
                    <span>SL: ${quantity}</span>
                    <span>${escapeHtml(product.category || "Nội thất")}</span>
                </div>
            </div>
            <div class="order-product-price">${formatCurrency(price * quantity)}</div>
        </div>
    `;
}

function bindOrderActions() {
    document.querySelectorAll(".order-detail-btn").forEach(button => {
        button.addEventListener("click", () => {
            showOrderDetail(button.dataset.code);
        });
    });

    document.querySelectorAll(".cancel-order-btn").forEach(button => {
        button.addEventListener("click", () => {
            openCancelModal(button.dataset.code);
        });
    });
}

function showOrderDetail(orderCode) {
    const order = getUserOrders().find(item => item.orderCode === orderCode);

    if (!order) {
        showToast("Không tìm thấy đơn hàng.", false);
        return;
    }

    document.getElementById("modalOrderCode").textContent = order.orderCode || "Chi tiết đơn hàng";
    document.getElementById("orderDetailContent").innerHTML = createOrderDetail(order);
    orderDetailModal.show();
}

function createOrderDetail(order) {
    const status = normalizeStatus(order.status);
    const statusInfo = getStatusInfo(status);
    const user = order.user || {};
    const payment = order.payment || {};
    const products = Array.isArray(order.products) ? order.products : [];

    return `
        <div class="detail-grid">
            <div class="detail-box">
                <div class="detail-box-title">Thông tin khách hàng</div>
                <div class="detail-row">
                    <span>Họ tên</span>
                    <strong>${escapeHtml(user.username || "N/A")}</strong>
                </div>
                <div class="detail-row">
                    <span>Email</span>
                    <strong>${escapeHtml(user.email || "N/A")}</strong>
                </div>
                <div class="detail-row">
                    <span>Số điện thoại</span>
                    <strong>${escapeHtml(user.phone || "N/A")}</strong>
                </div>
                <div class="detail-row">
                    <span>Địa chỉ</span>
                    <strong>${escapeHtml(user.address || "N/A")}</strong>
                </div>
                <div class="detail-row">
                    <span>Ghi chú</span>
                    <strong>${escapeHtml(user.note || "Không có")}</strong>
                </div>
            </div>
            <div class="detail-box">
                <div class="detail-box-title">Thông tin đơn hàng</div>
                <div class="detail-row">
                    <span>Mã đơn</span>
                    <strong>${escapeHtml(order.orderCode || "N/A")}</strong>
                </div>
                <div class="detail-row">
                    <span>Ngày đặt</span>
                    <strong>${formatDate(order.createdAt)}</strong>
                </div>
                <div class="detail-row">
                    <span>Thanh toán</span>
                    <strong>${getPaymentLabel(payment.method)}</strong>
                </div>
                <div class="detail-row">
                    <span>Trạng thái</span>
                    <strong>
                        <span class="order-status ${statusInfo.className}">
                            ${statusInfo.label}
                        </span>
                    </strong>
                </div>
            </div>
        </div>
        <h4 class="detail-products-title">Danh sách sản phẩm</h4>
        <div class="detail-products">
            ${products.map(product => createDetailProduct(product)).join("")}
        </div>
        <div class="detail-summary">
            <div class="detail-summary-row">
                <span>Tạm tính</span>
                <strong>${formatCurrency(order.subtotal || 0)}</strong>
            </div>
            <div class="detail-summary-row">
                <span>Phí vận chuyển</span>
                <strong>${Number(order.shippingFee || 0) === 0 ? "Miễn phí" : formatCurrency(order.shippingFee)}</strong>
            </div>
            <div class="detail-summary-total">
                <span>Tổng thanh toán</span>
                <strong>${formatCurrency(order.total || 0)}</strong>
            </div>
        </div>
    `;
}

function createDetailProduct(product) {
    const quantity = Number(product.quantity || 1);
    const price = Number(product.finalPrice || product.price || 0);

    return `
        <div class="detail-product">
            <div class="detail-product-image">
                <img src="${getProductImage(product.images)}" alt="${escapeHtml(product.name || "Product")}" onerror="this.src='https://placehold.co/300x300/eee8dc/333?text=Interior';">
            </div>
            <div>
                <div class="detail-product-name">${escapeHtml(product.name || "Sản phẩm")}</div>
                <div class="detail-product-info">
                    ${escapeHtml(product.brand || "N/A")} · ${escapeHtml(product.category || "Nội thất")} · Số lượng: ${quantity}
                </div>
            </div>
            <div class="detail-product-price">${formatCurrency(price * quantity)}</div>
        </div>
    `;
}

function openCancelModal(orderCode) {
    const order = getUserOrders().find(item => item.orderCode === orderCode);

    if (!order) {
        showToast("Không tìm thấy đơn hàng.", false);
        return;
    }

    if (normalizeStatus(order.status) !== "Pending") {
        showToast("Chỉ có thể hủy đơn hàng đang ở trạng thái Pending.", false);
        return;
    }

    selectedOrderIndex = orders.findIndex(item => item.orderCode === orderCode);

    if (selectedOrderIndex === -1) {
        showToast("Không tìm thấy đơn hàng.", false);
        return;
    }

    cancelOrderModal.show();
}

function cancelSelectedOrder() {
    if (selectedOrderIndex === -1) {
        return;
    }

    const order = orders[selectedOrderIndex];

    if (!order) {
        cancelOrderModal.hide();
        return;
    }

    if (normalizeStatus(order.status) !== "Pending") {
        cancelOrderModal.hide();
        showToast("Đơn hàng này không thể hủy.", false);
        return;
    }

    order.status = "Canceled";

    if (order.payment) {
        order.payment.status = "Canceled";
    }

    order.canceledAt = new Date().toISOString();

    saveOrders();

    cancelOrderModal.hide();
    selectedOrderIndex = -1;

    renderOrders();
    showToast("Đã hủy đơn hàng thành công.", true);
}

function saveOrders() {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function normalizeStatus(status) {
    const validStatuses = [
        "Pending",
        "Confirmed",
        "Shipping",
        "Returning",
        "Delivered",
        "Canceled"
    ];

    const normalized = String(status || "Pending");

    return validStatuses.includes(normalized)
        ? normalized
        : "Pending";
}

function getStatusInfo(status) {
    const statusMap = {
        Pending: {
            label: "Chờ xử lý",
            className: "status-pending"
        },
        Confirmed: {
            label: "Đã xác nhận",
            className: "status-confirmed"
        },
        Shipping: {
            label: "Đang giao hàng",
            className: "status-shipping"
        },
        Returning: {
            label: "Đang hoàn trả",
            className: "status-returning"
        },
        Delivered: {
            label: "Đã giao hàng",
            className: "status-delivered"
        },
        Canceled: {
            label: "Đã hủy",
            className: "status-canceled"
        }
    };

    return statusMap[status] || statusMap.Pending;
}

function getPaymentLabel(method) {
    const methods = {
        COD: "Thanh toán khi nhận hàng",
        CARD: "Thẻ ngân hàng"
    };

    return methods[method] || "Không xác định";
}

function showToast(message, success) {
    const toastIcon = document.getElementById("toastIcon");
    const toastMessage = document.getElementById("toastMessage");

    toastIcon.className = success
        ? "bi bi-check-circle"
        : "bi bi-exclamation-circle";

    toastIcon.style.color = success
        ? "var(--luxury-success)"
        : "var(--luxury-danger)";

    toastMessage.textContent = message;
    orderToast.show();
}

function getProductImage(imageName) {
    if (!imageName) {
        return "https://placehold.co/300x300/eee8dc/333?text=Interior";
    }

    if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
        return imageName;
    }

    return `./assets/images/${imageName}`;
}

function formatCurrency(value) {
    return new Intl.NumberFormat("vi-VN").format(Number(value || 0)) + " ₫";
}

function formatNumber(value) {
    return new Intl.NumberFormat("vi-VN").format(Number(value || 0));
}

function formatDate(value) {
    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}