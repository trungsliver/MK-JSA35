// bài 1: Lấy dữ liệu từ API 
    // Gọi API
fetch('https://jsonplaceholder.typicode.com/todos')
    // Chuyển đổi dữ liệu thành dạng JSON
    .then(response => response.json())
    // Xử lý dữ liệu
    .then(data => {
        // Dùng DOM lấy container
        const container = document.getElementById('todo-list');

        // Duyệt dữ liệu
        for (let i = 0; i < 20; i++) {
            // Tạo thẻ div có class = 'card' cho mỗi phần tử
            const card = document.createElement('div');
            card.classList.add('card');

            // Thêm nội dung vào card
            card.innerHTML = `
                <h3>${data[i].title}</h3>
                <p>ID: ${data[i].id}</p>
                <p>User ID: ${data[i].userId}</p>
                <p>Completed: ${data[i].completed}</p>
            `;

            // Thêm card vào container
            container.appendChild(card);
        }
    })

// Bài 2: Post list
fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('post-list');

        for (let i=0; i <20; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <h3>${data[i].title}</h3>
                <p>${data[i].body}</p>
            `;
            container.appendChild(card);
        }
    });