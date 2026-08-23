const serviceData = {
    design: {
        title: "Thiết kế nội thất",
        icon: "bi-pencil-square",
        description: "Dịch vụ thiết kế nội thất giúp biến ý tưởng của bạn thành một không gian sống hoàn chỉnh, cân bằng giữa thẩm mỹ, công năng và phong cách cá nhân.",
        features: ["Tư vấn phong cách", "Bố trí mặt bằng", "Lựa chọn vật liệu", "Thiết kế nội thất"]
    },
    "3d": {
        title: "Thiết kế 3D & Visual",
        icon: "bi-layers",
        description: "Công nghệ thiết kế 3D giúp khách hàng hình dung trực quan không gian sau khi hoàn thiện, từ màu sắc, vật liệu đến ánh sáng và đồ nội thất.",
        features: ["Phối cảnh 3D", "Render chân thực", "Thiết kế ánh sáng", "Visual Concept"]
    },
    construction: {
        title: "Thi công nội thất",
        icon: "bi-tools",
        description: "Đội ngũ thi công chuyên nghiệp đảm bảo quá trình sản xuất, vận chuyển và lắp đặt được thực hiện chính xác theo hồ sơ thiết kế.",
        features: ["Sản xuất nội thất", "Thi công tại công trình", "Lắp đặt chuyên nghiệp", "Kiểm soát chất lượng"]
    },
    custom: {
        title: "Thiết kế theo yêu cầu",
        icon: "bi-house-heart",
        description: "Tạo nên những sản phẩm nội thất độc bản theo kích thước, chất liệu, màu sắc và phong cách riêng của từng khách hàng.",
        features: ["Kích thước tùy chỉnh", "Chất liệu cao cấp", "Màu sắc riêng", "Thiết kế độc bản"]
    },
    consulting: {
        title: "Tư vấn không gian",
        icon: "bi-chat-square-text",
        description: "Chuyên gia của chúng tôi sẽ tư vấn cách tối ưu diện tích, lựa chọn nội thất và xây dựng ngân sách phù hợp với nhu cầu thực tế.",
        features: ["Khảo sát không gian", "Tư vấn bố trí", "Tư vấn vật liệu", "Tối ưu ngân sách"]
    },
    maintenance: {
        title: "Bảo hành & bảo trì",
        icon: "bi-shield-check",
        description: "Chúng tôi tiếp tục đồng hành cùng khách hàng sau khi bàn giao với chính sách bảo hành và dịch vụ bảo trì nội thất chuyên nghiệp.",
        features: ["Bảo hành sản phẩm", "Bảo trì định kỳ", "Hỗ trợ kỹ thuật", "Chăm sóc khách hàng"]
    }
};

document.addEventListener("DOMContentLoaded", initServices);

function initServices() {
    setupServiceDetails();
    setupConsultation();
    setupCounters();
    setupScrollAnimation();
}

function setupServiceDetails() {
    const buttons = document.querySelectorAll(".service-detail-btn");
    const modalElement = document.getElementById("serviceDetailModal");
    const modal = new bootstrap.Modal(modalElement);

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const service = serviceData[button.dataset.service];

            if (!service) {
                return;
            }

            document.getElementById("serviceModalTitle").textContent = service.title;
            document.getElementById("serviceModalIcon").className = `bi ${service.icon}`;
            document.getElementById("serviceModalDescription").textContent = service.description;
            document.getElementById("serviceModalFeatures").innerHTML = service.features.map(feature => `
                <div class="modal-feature">
                    <i class="bi bi-check-lg"></i>
                    <span>${feature}</span>
                </div>
            `).join("");

            modal.show();
        });
    });
}

function setupConsultation() {
    const modalElement = document.getElementById("consultationModal");
    const modal = new bootstrap.Modal(modalElement);
    const buttons = document.querySelectorAll(".consultation-btn, .consultation-modal-btn");
    const form = document.getElementById("consultationForm");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            if (button.classList.contains("consultation-btn")) {
                modal.show();
            }
        });
    });

    form.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("customerName").value.trim();
        const phone = document.getElementById("customerPhone").value.trim();
        const email = document.getElementById("customerEmail").value.trim();
        const message = document.getElementById("customerMessage").value.trim();

        if (!name || !phone || !email) {
            alert("Vui lòng nhập đầy đủ thông tin bắt buộc.");
            return;
        }

        const consultation = {
            id: `CONSULT-${Date.now()}`,
            name,
            phone,
            email,
            message,
            createdAt: new Date().toISOString(),
            status: "Pending"
        };

        const consultations = JSON.parse(localStorage.getItem("consultations") || "[]");
        consultations.push(consultation);
        localStorage.setItem("consultations", JSON.stringify(consultations));

        form.reset();
        modal.hide();
        alert("Cảm ơn bạn! Yêu cầu tư vấn đã được gửi thành công.");
    });
}

function setupCounters() {
    const counters = document.querySelectorAll(".counter");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting || entry.target.dataset.animated === "true") {
                return;
            }

            animateCounter(entry.target);
            entry.target.dataset.animated = "true";
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = Number(element.dataset.target);
    const duration = 1500;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        element.textContent = value.toLocaleString("vi-VN");

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

function setupScrollAnimation() {
    const elements = document.querySelectorAll(".service-card, .process-item, .stat-item");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => observer.observe(element));
}