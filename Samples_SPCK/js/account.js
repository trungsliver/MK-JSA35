const loginSection = document.getElementById("login-section");
const registerSection = document.getElementById("register-section");
const accountSection = document.getElementById("account-section");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginMessage = document.getElementById("login-message");
const registerMessage = document.getElementById("register-message");
const logoutButton = document.getElementById("logout-btn");
const getUsers = () => JSON.parse(localStorage.getItem("users") || "[]");
const saveUsers = users => localStorage.setItem("users", JSON.stringify(users));
const showSection = section => {
    [loginSection, registerSection, accountSection].forEach(item => item.classList.add("hidden"));
    section.classList.remove("hidden");
};
const showMessage = (element, message, type) => {
    element.textContent = message;
    element.className = `form-message ${type}`;
};
const validEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validPhone = phone => /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/.test(phone);
const validPassword = password => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
const calculateAge = dob => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
};
const hashPassword = async password => {
    const data = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer)).map(byte => byte.toString(16).padStart(2, "0")).join("");
};
const formatDate = value => {
    const date = new Date(value);
    return date.toLocaleString("vi-VN");
};
const displayAccount = user => {
    document.getElementById("profile-username").textContent = user.username;
    document.getElementById("profile-username-info").textContent = user.username;
    document.getElementById("profile-email").textContent = user.email;
    document.getElementById("profile-phone").textContent = user.phone;
    document.getElementById("profile-dob").textContent = user.dob;
    document.getElementById("profile-last-login").textContent = formatDate(user.last_login);
    document.getElementById("profile-avatar").querySelector("span").textContent = user.username.charAt(0).toUpperCase();
    showSection(accountSection);
};
const currentUser = JSON.parse(localStorage.getItem("current_user") || "null");
if (currentUser) displayAccount(currentUser);
else showSection(loginSection);
document.querySelectorAll(".switch-btn").forEach(button => {
    button.addEventListener("click", () => {
        const target = document.getElementById(button.dataset.targetSection);
        showSection(target);
        loginMessage.textContent = "";
        registerMessage.textContent = "";
        loginForm.reset();
        registerForm.reset();
    });
});
document.querySelectorAll(".password-toggle").forEach(button => {
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.target);
        const icon = button.querySelector("i");
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        icon.className = isPassword ? "bi bi-eye-slash" : "bi bi-eye";
    });
});
registerForm.addEventListener("submit", async event => {
    event.preventDefault();
    const username = document.getElementById("register-username").value.trim();
    const email = document.getElementById("register-email").value.trim().toLowerCase();
    const phone = document.getElementById("register-phone").value.trim();
    const dob = document.getElementById("register-dob").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("register-confirm").value;
    const terms = document.getElementById("register-terms").checked;
    const users = getUsers();
    if (username.length < 3) return showMessage(registerMessage, "Username phải có ít nhất 3 ký tự.", "error");
    if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) return showMessage(registerMessage, "Username đã được sử dụng.", "error");
    if (!validEmail(email)) return showMessage(registerMessage, "Email không đúng định dạng.", "error");
    if (users.some(user => user.email.toLowerCase() === email)) return showMessage(registerMessage, "Email đã được đăng ký.", "error");
    if (!validPhone(phone)) return showMessage(registerMessage, "Số điện thoại Việt Nam không hợp lệ.", "error");
    if (!dob) return showMessage(registerMessage, "Vui lòng chọn ngày sinh.", "error");
    if (calculateAge(dob) < 13) return showMessage(registerMessage, "Tài khoản yêu cầu người dùng từ 13 tuổi trở lên.", "error");
    if (!validPassword(password)) return showMessage(registerMessage, "Password phải có ít nhất 6 ký tự, gồm chữ hoa, chữ thường và số.", "error");
    if (password !== confirmPassword) return showMessage(registerMessage, "Confirm Password không trùng khớp.", "error");
    if (!terms) return showMessage(registerMessage, "Bạn cần đồng ý với Terms and Conditions.", "error");
    const hashedPassword = await hashPassword(password);
    users.push({ username, email, phone, dob, pass: hashedPassword });
    saveUsers(users);
    showMessage(registerMessage, "Đăng ký thành công! Đang chuyển sang đăng nhập...", "success");
    setTimeout(() => {
        registerForm.reset();
        loginForm.reset();
        showSection(loginSection);
        document.getElementById("login-email").value = email;
    }, 1000);
});
loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;
    const users = getUsers();
    if (!validEmail(email)) return showMessage(loginMessage, "Email không đúng định dạng.", "error");
    if (!validPassword(password)) return showMessage(loginMessage, "Password phải có ít nhất 6 ký tự, gồm chữ hoa, chữ thường và số.", "error");
    const hashedPassword = await hashPassword(password);
    const user = users.find(item => item.email.toLowerCase() === email && item.pass === hashedPassword);
    if (!user) return showMessage(loginMessage, "Email hoặc password không chính xác.", "error");
    const currentUserData = { username: user.username, email: user.email, phone: user.phone, dob: user.dob, last_login: new Date().toISOString() };
    localStorage.setItem("current_user", JSON.stringify(currentUserData));
    showMessage(loginMessage, "Đăng nhập thành công!", "success");
    setTimeout(() => displayAccount(currentUserData), 600);
});
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("current_user");
    loginForm.reset();
    showMessage(loginMessage, "Bạn đã đăng xuất khỏi tài khoản.", "success");
    showSection(loginSection);
});