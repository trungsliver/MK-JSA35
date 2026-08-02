/* login.js - Xử lý đăng nhập người dùng */

// Nếu đã đăng nhập, chuyển hướng về trang chủ
if (localStorage.getItem("currentUser")) {
    location.href = "./index.html";
  }
  
  // Lấy phần tử form từ DOM
  let form = document.querySelector("form");
  
  // Lắng nghe sự kiện submit của form
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Ngăn chặn tải lại trang khi gửi form
  
    // Kiểm tra xem có dữ liệu người dùng trong localStorage không
    if (!localStorage.getItem("users")) {
      alert("No user found"); // Thông báo nếu không tìm thấy người dùng nào
    } else {
      // Lấy danh sách người dùng từ localStorage
      let users = JSON.parse(localStorage.getItem("users"));
  
      // Lấy giá trị email và password từ input
      let email = document.getElementById("email");
      let password = document.getElementById("password");
  
      // Tìm kiếm người dùng có email và mật khẩu trùng khớp
      let existingUser = users.find(
        (index) =>
          index.email === email.value.trim() &&
          index.password === password.value.trim()
      );
  
      if (existingUser) {
        // Lưu thông tin người dùng đang đăng nhập vào localStorage
        localStorage.setItem("currentUser", JSON.stringify(existingUser));
        
        // Chuyển hướng đến trang chính
        location.href = "/index.html";
      } else {
        alert("Email or password is incorrect"); // Thông báo lỗi nếu thông tin không đúng
      }
    }
  });