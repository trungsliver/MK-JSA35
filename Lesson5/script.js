// Bài 1: Hiển thị dữ liệu từ file data.js
    // Dùng DOM lấy container
const container1 = document.getElementById('studentList');
    // Duyệt danh sách students
students.forEach(student => {
    // Tạo thẻ div cho từng học sinh
    const studentDiv = document.createElement('div');
    // Thêm class cho từng thẻ studentDiv
    studentDiv.classList.add('student');
    // Thêm thông tin học sinh vào thẻ
    studentDiv.innerHTML = `
        <p>ID: ${student.id}</p>
        <h3>${student.name}</h3>
        <p>Age: ${student.age}</p>
    `;
    // Thêm thẻ vào container
    container1.appendChild(studentDiv);
});