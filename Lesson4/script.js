// DOM- Document Object Model
    // Cấu trúc mô phỏng HTML dưới dạng cây (tree)

    // Lấy phần tử theo id -> trả về 1 phần tử
const header = document.getElementById('myH1')
console.log(header)

    // Lấy phần tử theo class -> trả về danh sách
const classElements = document.getElementsByClassName('myClass');
console.log(classElements);

    // Lấy phần tử theo tag name (tên thẻ) -> trả về danh sách
const pElements = document.getElementsByTagName('p');
console.log(pElements);

    // lấy tất cả phần tử theo selector (css) -> trả về danh sách
const queryElements = document.querySelectorAll('.myClass');
console.log(queryElements);

    // lấy phần tử đầu tiên theo selector (css) -> trả về 1 phần tử
const firstQueryElement = document.querySelector('.myClass');
console.log(firstQueryElement);

    // innerHTML: lấy nội dung bên trong thẻ (bao gồm cả thẻ con)
const content = header.innerHTML;
console.log(content);

    // textContent: lấy nội dung bên trong thẻ (chỉ lấy text)
const textContent = header.textContent;
console.log(textContent);

    // style: thay đổi css của phần tử
header.style.color = 'darkred';
header.style.backgroundColor = 'lightblue';
header.style.fontFamily = "Momo Signature, cursive";

    // setAtribute: thay đổi thuộc tính của phần tử
firstQueryElement.setAttribute('class', 'myClass test1');

    // Tạo phần tử mới
const newDiv = document.createElement('div');
newDiv.setAttribute('class', 'container');

    // Thêm phần tử mới vào trong thẻ body
document.body.appendChild(newDiv);
        // Chỉnh sửa text của thẻ div vừa tạo
newDiv.textContent = 'Thẻ div mới nè';

// ==================== THỰC HÀNH ====================
    // btn1: thay đổi text h1
function changeText() {
    // Dùng DOM lấy thẻ h1
    const h1 = document.getElementById('myH1');
    // Thay đổi text của thẻ h1
    h1.textContent = 'Minh Trí chưa làm BTVN';
}

    // btn2: hiện alert khi click
function showAlert() {
    alert('Bạn vừa click vào button 2');
}

    // btn3: đổi màu nèn của body
document.getElementById('btn3').onclick = function() {
    document.body.style.backgroundColor = 'salmon';
}

// Bài tập FORM: validate email, password
document.getElementById('myForm').onsubmit = function(event) {
    // Ngăn chặn hành vi mặc định của form (submit)
    event.preventDefault(); 

    // Dùng DOM lấy nội dung input của email và password
        // trim(): loại bỏ khoảng trắng đầu và cuối chuỗi
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Kiểm tra đã nhập email và password chưa
    if (username == '' ||email === '' || password === '') {
        alert('Vui lòng nhập đầy đủ email và password');
        return; // Dừng hàm
    }

    // Username ít nhất 3 ký tự
    if (username.length < 3) {
        alert('Username phải có ít nhất 3 ký tự');
        return; // Dừng hàm
    }

    // Email phải đúng định dạng (dùng regular expression - regex)
    if (!validateEmail(email)) {
        alert('Email không hợp lệ');
        return; // Dừng hàm
    }

    // Password: min 6 ký tự, gồm viết hoa, viết thường, số, ký tự đặc biệt
    if (!validatePassword(password)) {
        alert('Password không hợp lệ. Yêu cầu: ít nhất 6 ký tự, gồm viết hoa, viết thường, số và ký tự đặc biệt');
        return; // Dừng hàm
    }
}

function validateEmail(email) {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
}

function validatePassword(password) {
    //     ^
    // (?=.*[a-z])        // Có ít nhất 1 chữ thường
    // (?=.*[A-Z])        // Có ít nhất 1 chữ hoa
    // (?=.*\d)           // Có ít nhất 1 chữ số
    // (?=.*[^A-Za-z0-9]) // Có ít nhất 1 ký tự đặc biệt
    // .{6,}              // Độ dài tối thiểu 6 ký tự
    // $
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
    return regex.test(password);
}