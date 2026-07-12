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