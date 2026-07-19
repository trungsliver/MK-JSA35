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

// Bài 2: Hiển thị dữ liệu từ file data.json
    // Lấy dữ liệu từu file data.json
fetch('./data.json')
    // Chuyển đổi dữ liệu sang dạng JSON
    .then(response => response.json())
    // Xử lý dữ liệu sau khi chuyển đổi
    .then(data => {
        // Dùng DOM lấy container
        const container2 = document.getElementById('productList');

        // Duyệt danh sách sản phẩm từ file data.json
        data.forEach(item => {
            // Tạo thẻ div cho từng sản phẩm
            const itemDiv = document.createElement('div');
            // Thêm class cho từng thẻ itemDiv
            itemDiv.classList.add('product-card');
            // Thêm thông tin sản phẩm vào thẻ
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>Price: ${item.price}</p>
            `;
            // Thêm thẻ vào container
            container2.appendChild(itemDiv);
        })
    })