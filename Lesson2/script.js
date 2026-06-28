// Hiển thị dữ liệu ra console
console.log("Hello World!");

// Hiện thị thông báo (pop up)
// alert('MK-JSA35')

// Variables - Biến số
    // Dùng để luuw trữ dữ liệu
    // Có thể thay đổi giá trị khi lập trình
var name = "Duc Trung";
let age = 2;

// Constant - Hằng số
    // Dùng để lưu trữ dữ liệu
    // Không thể thay đổi giá trị khi lập trình
const PI = 3.14;

// Quy tắc đặt tên biến:
    // camelCase: viết hoa chữ cái đầu mỗi từ, trừ từ đầu tiên
let mySampleVariable = "Hello World!";
    // snake_case: giữa các từ dùng dấu gạch dưới
let my_sample_variable = "Hello World!";

// Quy tắc đặt tên hằng số: snake_case, viết in hoa tất cả chữ
const MY_SAMPLE_CONSTANT = "Hello World!";

// Data types - Kiểu dữ liệu
    // Primitives - Kiểu dữ liệu nguyên thủy
        // Strings - Chuỗi ký tự (không hẳn là primitive)
let  address = "505 Minh Khai"
        // Number: số (Z, R, Infinity, NaN)
let score = 8.5
let inf_num = Infinity
let nan_num = NaN
        // Boolean: logic (chỉ gồm true/false)
let isMale = true
        //  Null: rỗng (thường để reset dữ liệu)
let empty = null
        // Undefined: chưa xác định (thường để khai báo biến)
let notDefined

    // None- primitives - Kiểu dữ liệu không nguyên thủy
        // object - Đối tượng (cặp key-value)
let student1 = {
    name: "Duc Trung",
    age: 2,
    isMale: true
}
console.log(student1)
console.log('Name:', student1.name)

        // array - Mảng (các phần tử được đánh số thứ tự)
let students = ["Minh", "An", 'Hoàng', 'Nguyên', 'Trí']
console.log(students[0])  // Phần tử đầu tiên

        // function - hàm (tập hợp nhiều lệnh, có thể tái sdung)
            // Hàm không có giá trị trả về
function sayHello(name) {
    // sử dụng dấu bacltick ` (trên nút tab)
    console.log(`Hello ${name}`)
    console.log('Tôi học lớp MK - JSA35')
}
sayHello('Duc Trung')

            // Hàm có giá trị trả về
function sum(a, b) {
    return a + b
}
console.log('Test function add:', sum(5, 10))

            // arrow function:
const sumArrow = (a, b) => a + b
const sumArrow2 = (a, b) => {
    let result = a + b
    return result
}

// Xác định và chuyển đổi kiểu dữ liệu
    // Xác định kiểu dữ liệu - typeof
console.log('Type of name:', typeof name)
console.log('Type of age:', typeof age)
    // Chuyển đổi kiểu dữ liệu
let x1 = 5
x1 = String(x1)  // Number -> String
let x2 = "pizza"
x2 = Number(x2)  // String -> Number (NaN)

// String mothods - các phương thức hay dùng với string
let str = 'Duc Trung';
    // length - độ dài chuỗi
console.log('length:', str.length);
    // toUpperCase() - chuyển thành chữ in hoa
console.log('toUpperCase:', str.toUpperCase());
    // toLowerCase() - chuyển thành chữ in thường
console.log('toLowerCase:', str.toLowerCase());
    // charAt(index) - lấy ký tự tại vị trí index
console.log('charAt(7):', str.charAt(7));
console.log('charAt(7):', str[7]); 
    // indexOf(substring) - tìm vị trí của chuỗi con 
console.log('indexOf("Nam"):', str.indexOf('Nam')); // 6


// Toán tử số học - các phép toán
    // Cơ bản: + - * /
    // Chia lấy dư: %
    // Lũy thừa: **
console.log(' 7 / 3 =', 7 / 3);
console.log(' 7 % 3 =', 7 % 3);
console.log(' 2 ** 3 =', 2 ** 3);

// Toán tử gán
let a1 = 20;
a1 += 5;  // a1 = a1 + 5
console.log('a1 += 5 =>', a1);

a1++;  // a1 = a1 + 1
console.log('a1++ =>', a1);

// Toán tử so sánh & Biểu thức logic => Kết quả true/false
    // So sánh: == != > < >= <=
console.log('5 == 5', 5 == 5);       // true
console.log('5 != 3', 5 != 3);       // true
console.log('5 < 3', 5 < 3);         // false
    // Biểu thức logic: && (AND), || (OR), ! (NOT)
        // Ví dụ trà sữa - gà rán

// Câu điều kiện (3 dạng)
    // Dạng thiếu: if
age = 5;
if (age >= 18) {
    console.log('Bạn đã đủ 18 tuổi');
}

    // Dạng đủ: if - else
age = 5;
if (age >= 18) {
    console.log('Bạn đã đủ 18 tuổi');
} else {
    console.log('Bạn chưa đủ 18 tuổi');
}

    // Dạng đa nhánh
score = 7;
if (8 <= score && score <= 10){
    console.log('Học lực: Giỏi');
} else if (6.5 <= score && score < 8){
    console.log('Học lực: Khá');
} else if (5 <= score && score < 6.5){
    console.log('Học lực: Trung bình');
} else if (0 <= score && score < 5) {
    console.log('Học lực: Yếu');
} else {
    console.log('Điểm không hợp lệ');
}

