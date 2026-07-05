// Câu điều kiện (viết tắt)
    // condition ? codeIfTrue : codeIfFalse
let age = 99;

    // Cách viết bình thường
if (age >= 18) {
    console.log("Bạn đã đủ 18 tuổi");
} else {
    console.log("Bạn chưa đủ 18 tuổi");
}

    // Cách viết rút gọn
let message = age >= 18 ? "Đủ tuổi" : "Chưa đủ tuổi";
console.log('Thông báo:', message);

// Vòng lặp for: (start; condition; step)
for (let i=1; i<=5; i++) {
    console.log("Vòng lặp for lần thứ: ", i);
}

// Vòng lặp while:
let j = 1;
while (j <= 10) {
    console.log("Vòng lặp while lần thứ:", j);
    j += 2;
}

// Mảng - Array / List  (thao tác CRUD)
    // Create - Khởi tạo
let arr = [];
let jsa35 = ['Minh', 'Khiêm', 'An', 'Nguyên', 'Hoàng', 'Trí']

    // Read - Đọc phần tử
console.log('Danh sách:', jsa35);
console.log('Độ dài mảng:', jsa35.length);
        // Truy cập phần tử theo index
console.log('Phần tử đầu tiên:', jsa35[0]);
console.log('Phần tử cuối cùng:', jsa35[jsa35.length - 1]);
console.log('Phần tử cuối cùng:', jsa35.at(-1));

        // Duyệt mảng
            // Cách 1: DÙng cả index và value
for (let i=0; i<jsa35.length; i++) {
    console.log(`Index: ${i}, Value: ${jsa35[i]}`);
}
            // Cách 2: chỉ dùng value
for (let item of jsa35) {
    console.log('Value:', item);
}

    // Update - Cập nhật phần tử
        // Thêm phần tử vào cuối mảng
jsa35.push('Trung');
        // Thêm phần tử vào đầu mảng
jsa35.unshift('Imposter');
        // Sửa phần tử theo index
jsa35[0] = 'Mai Hoàng Minh';

console.log('Danh sách sau khi thêm/sửa:', jsa35);

    // Delete - Xóa phần tử
        // Xóa phần tử cuối mảng
jsa35.pop();
        // Xóa phần tử đầu mảng
jsa35.shift();
        // Xóa phần tử theo index
jsa35.splice(2, 1); // Xóa 1 phần tử tại index 2
jsa35.splice(4, 2); // Xóa 2 phần tử từ index 4

    // Sắp xếp mảng
        // Sắp xếp theo thứ tự tăng dần A-Z
jsa35.sort();
console.log('Mảng sau khi sắp xếp tăng dần A-Z:', jsa35);
        // Sắp xếp theo thứ tự giảm dần Z-A
jsa35.reverse();
console.log('Mảng sau khi sắp xếp giảm dần Z-A:', jsa35);

// Hàm - Function
    // ý nghĩa: tập hợp các câu lệnh xử lý 1 nhiệm vụ, có thể tái sử dụng nhiều lần

    // Hàm không tham số, không trả về
function sayHello() {
    console.log('Xin chào các bạn, mình đang học ở MindX')
    console.log('Lớp: MK-JSA30')
}
sayHello();

    // Hàm có tham số, không trả về
function greet(name) {
    console.log(`Xin chào! Tôi tên là ${name}!`);
}
greet('Dũng');
greet('Minh');

    // Hàm có tham số, có trả về
function sum(a, b) {
    return a + b;
}
console.log('Tổng 2 số 5 và 10 là:', sum(5, 10));
console.log('Tổng 2 số 20 và 30 là:', sum(20, 30));

// Arrow function (ES6) - lambda function
        // Cú pháp cơ bản
const multiply = (a, b) => a * b;
console.log('Tích 2 số 5 và 10 là:', multiply(5, 10));

        // Arrow function không tham số
const getPI = () => 3.14;
console.log('Giá trị PI là:', getPI());

        // Arrow function viết nhiều dòng
const show_info = (username, age, gender) => {
    console.log('--- User Info ---');
    console.log('Username:', username);
    console.log('Age:', age);
    console.log('Gender:', gender);
    console.log('-----------------');
}
show_info('Duc Trung', 2, 'Male');