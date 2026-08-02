// Khai báo localStorage key
    // Danh sách toàn bộ người dùng
const STORAGE_KEY = "users";
    // Người dùng hiện tại (đang đăng nhập)
const CURRENT_USER_KEY = "currentUser";

// Dùng DOM lấy các phần tử
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const registerMessage = document.getElementById("register-message");
const loginMessage = document.getElementById("login-message");
const userPanelTitle = document.getElementById("user-panel-title");
const userPanelDetails = document.getElementById("user-panel-details");
const logoutButton = document.getElementById("logout-button");

// Hiện message
function showMessage(messageElement, text, type = "info") {
    // Gán nội dung cho thông báo
    messageElement.textContent = text;
    // Thêm class để định dạng thông báo (chỉnh màu sắc theo type)
    if (type === "success" || type === "error") {
        messageElement.className = `message ${type}`;
    } else {
        messageElement.className = "message";
    }
}

// Hash password (đơn giản, chỉ để demo)
function hashPassword(password) {
    // Sử dụng thuật toán hash đơn giản (djb2) để tạo hash từ password
    let hash = 5381;
    // Duyệt qua từng ký tự của password và cập nhật hash
    for (const character of password) {
        hash = (hash * 33) ^ character.charCodeAt(0);
    }
    // Trả về hash dưới dạng chuỗi hex, đảm bảo là một chuỗi hợp lệ bằng cách sử dụng toán tử >>> 0 để chuyển sang số dương
    return `${(hash >>> 0).toString(16)}`;
}

// Validate email và số điện thoại bằng regex (regular expression)
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^(0|\+84)\d{9,10}$/.test(phone);
}

// Tính tuổi bằng ngày sinh
function getAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age -= 1;
    }

    return age;
}

// Dùng DOM lấy dữ liệu form đăng ký
function getRegisterData() {
    return {
        username: document.getElementById("register-username").value.trim(),
        email: document.getElementById("register-email").value.trim().toLowerCase(),
        phone: document.getElementById("register-phone").value.trim(),
        dob: document.getElementById("register-dob").value,
        password: document.getElementById("register-password").value,
        confirmPassword: document.getElementById("register-confirm-password").value,
        agreed: document.getElementById("register-agree").checked,
    };
}


// Validate form đăng ký
function validateRegisterData(formData, users) {
    if (!formData.username || formData.username.length < 3) {
        return "Username không hợp lệ.";
    }

    if (!formData.email || !validateEmail(formData.email)) {
        return "Email không hợp lệ.";
    }

    if (users.some((user) => user.email === formData.email)) {
        return "Email đã được đăng ký.";
    }

    if (!formData.phone || !validatePhone(formData.phone)) {
        return "Số điện thoại không hợp lệ.";
    }

    if (!formData.dob) {
        return "Vui lòng chọn ngày sinh.";
    }

    if (getAge(formData.dob) < 13) {
        return "Người dùng phải từ 13 tuổi trở lên.";
    }

    if (!formData.password || formData.password.length < 6) {
        return "Password phải có ít nhất 6 ký tự.";
    }

    if (formData.password !== formData.confirmPassword) {
        return "Confirm password không khớp.";
    }

    if (!formData.agreed) {
        return "Bạn cần đồng ý với điều khoản.";
    }

    return "";
}


// Sự kiện submit form đăng ký
function handleRegister(event) {
    // Ngăn chặn hành vi submit mặc định của form để xử lý bằng JavaScript
    event.preventDefault();

    // Lấy danh sách người dùng hiện tại từ localStorage, nếu không có thì khởi tạo một mảng rỗng
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    // Lấy dữ liệu từ form đăng ký
    const formData = getRegisterData();
    // Validate dữ liệu form đăng ký
    // Lỗi => Hiện message lỗi và dừng xử lý
    // Hợp lệ => Tiếp tục xử lý
    const validationError = validateRegisterData(formData, users);

    if (validationError) {
        showMessage(registerMessage, validationError, "error");
        return;
    }

    const hashedPassword = hashPassword(formData.password);
    const newUser = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    // Lưu người dùng mới vào localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    registerForm.reset();
    showMessage(registerMessage, "Đăng ký thành công.", "success");
}


// Sự kiện submit form đăng nhập
function handleLogin(event) {
    // Ngăn chặn hành vi submit mặc định của form để xử lý bằng JavaScript
    event.preventDefault();

    // Dùng DOM lấy dữ liệu form đăng nhập
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        showMessage(loginMessage, "Vui lòng nhập đủ thông tin.", "error");
        return;
    }

    if (!validateEmail(email)) {
        showMessage(loginMessage, "Email đăng nhập không đúng định dạng.", "error");
        return;
    }

    // Lấy danh sách người dùng hiện tại từ localStorage, nếu không có thì khởi tạo một mảng rỗng
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const foundUser = users.find((user) => user.email === email);

    if (!foundUser) {
        showMessage(loginMessage, "Email chưa được đăng ký.", "error");
        return;
    }

    const hashedPassword = hashPassword(password);

    if (foundUser.password !== hashedPassword) {
        showMessage(loginMessage, "Password không chính xác.", "error");
        return;
    }

    // Lưu thông tin người dùng hiện tại vào localStorage (không lưu password)
    let currentUser = {
        username: foundUser.username,
        email: foundUser.email,
        phone: foundUser.phone,    
        dob: foundUser.dob,
        loginAt: new Date().toISOString(),
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

    loginForm.reset();
    showCurrentUser();
    showMessage(loginMessage, `Đăng nhập thành công.`, "success");
}


// Sự kiện logout
function handleLogout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    showCurrentUser();
}


// Hiện người dùng hiện tại
function showCurrentUser() {
    // Lấy người dùng hiện tại từ localStorage, nếu không có thì trả về null
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || null;

    if (currentUser) {
        userPanelTitle.textContent = `Xin chào ${currentUser.username}`;
        userPanelDetails.innerHTML = `<p>Email: ${currentUser.email}</p>
                                      <p>Phone: ${currentUser.phone}</p>
                                      <p>DOB: ${currentUser.dob}</p>
                                      <p>Login At: ${currentUser.loginAt}</p>`;
        logoutButton.disabled = false;
    } else {
        userPanelTitle.textContent = "Chưa đăng nhập";
        userPanelDetails.textContent = "Sau khi đăng nhập, thông tin tài khoản sẽ hiển thị ở đây.";
        logoutButton.disabled = true;
    }
}

registerForm.addEventListener("submit", handleRegister);
loginForm.addEventListener("submit", handleLogin);
logoutButton.addEventListener("click", handleLogout);
showCurrentUser();