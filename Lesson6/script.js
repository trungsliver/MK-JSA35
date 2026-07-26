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

// Bài 3: Darkmode - Lightmode
    // Dùng DOM lấy button chuyển theme
const themeButton = document.getElementById('themeBtn');
    // Xử lý sự kiện ấn nút
themeButton.onclick = () => {
    // Thêm hoặc xóa class 'darkmode vào body
    document.body.classList.toggle('darkmode');
    // Lưu trạng thái theme vào localStorage
    if (document.body.classList.contains('darkmode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

    // Load theme khi reload trang
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark');
}

// Bài 4: Note list
    // Lấy ghi chú trong localStorage hoặc khởi tạo danh sách rỗng
let notes = JSON.parse(localStorage.getItem('notes')) || [];
    // sự kiện thêm ghi chú
const addNoteBtn = document.getElementById('addNote');
addNoteBtn.onclick = () => {
    let content = document.getElementById('noteInput').value;
    if (content) {
        // Thêm vào danh sách notes
        notes.push(content);
        // Lưu vào localStorage
        localStorage.setItem('notes', JSON.stringify(notes));
        // Hiển thị lại danh sách ghi chú
        displayNotes();
        // Xóa nội dung input sau khi thêm
        document.getElementById('noteInput').value = '';
    }
}

function displayNotes() {
     const list = document.getElementById("note-list");
    list.innerHTML = "";
    notes.forEach((item, index) => {
        list.innerHTML += `<p>${item}</p>`;
    });
}
displayNotes();;