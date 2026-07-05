// Bài 1: Khai báo đúng kiểu dữ liệu cho các thông tin các nhân: 
    // Họ tên, Tuổi, Trường học, giới tính, điểm trung bình.
    // In ra màn hình các thông tin vừa nhập
let name = 'Duc Trung';
let age = 2;
let school = 'MindX';
let gender = 'Male';
let score = 9.5;
console.log('Họ tên:', name);
console.log('Tuổi:', age);
console.log('Trường học:', school);
console.log('Giới tính:', gender);
console.log('Điểm trung bình:', score);

// Bài 2: Nhập vào chiều dài và chiều rộng hình chữ nhật
    // In ra màn hình chu vi và diện tích hình chữ nhật đó.
let a = 10;
let b = 5;
let perimeter = (a + b) * 2;
let area = a * b;
console.log('Chu vi hình chữ nhật:', perimeter);
console.log('Diện tích hình chữ nhật:', area);

// Bài 3: Khai báo số nguyên n 
let n = 12;
    // Yêu cầu 1: Kiểm tra xem n có phải là số chẵn hay không.
if (n % 2 === 0){
    console.log(n, 'là số chẵn');
} else {
    console.log(n, 'là số lẻ');
}
    // Yêu cầu 2: Kiểm tra xem n có phải là số nguyên tố hay không.
let countSNT = 0;
for (let i = 1; i <= n; i++){
    if (n % i === 0){
        countSNT++;
    }
}
if (countSNT === 2){
    console.log(n, 'là số nguyên tố');
}else {
    console.log(n, 'không phải số nguyên tố');
}

// Bài 4: Nhập điểm số từ bàn phím. Hãy in ra mà hình xếp hạng học lực, biết rằng:
    // 8-10: Giỏi, 6.5-8: Khá, 5-6.5: Trung Bình, 0-5: Yếu
score = 9;
if (0 <= score && score < 5){
    console.log('Học lực: Yếu');
} else if (5 <= score && score < 6.5){
    console.log('Học lực: Trung bình');
} else if (6.5 <= score && score < 8){
    console.log('Học lực: Khá');
} else if (8 <= score && score <= 10){
    console.log('Học lực: Giỏi');
} else{
    console.log('Nhập sai dữ liệu');
}

// Bài 5: Khai báo 2 số nguyên a và b 
a = 5;
b = 15;
    // Yêu cầu 1: In ra tất cả các số trong khoảng [a, b] hoặc ngược lại
start = Math.min(a, b);
end = Math.max(a, b);
for (let i = start; i <= end; i++){
    console.log(i);
}
    // Yêu cầu 2: Tính tổng các số chia hết cho 3 trog khoảng vừa in
let sum3 = 0;
for (let i = start; i <= end; i++){
    if (i % 3 === 0) sum3 += i;
}
console.log('Tổng các số chia hết cho 3:', sum3);
    // Yêu cầu 3: In ra số lượng số lẻ có trong khoảng trên
let countOdd = 0;
for (let i = start; i <= end; i++){
    if (i % 2 !== 0) countOdd++;
}
console.log('Số lượng số lẻ:', countOdd);
    // Yeu cầu 4: Tính trung bình cộng các số trong khoảng trên (làm tròn đến chữ số thập phân thứ 2)
let sumAll = 0;
let countAll = 0;
for (let i = start; i <= end; i++){
    sumAll += i;
    countAll++;
}
let avg = sumAll / countAll;
console.log('Trung bình cộng:', avg.toFixed(2));    

// Bài 6: In ra bảng cửu chương từ 5 đến 9
for (let i = 5; i <= 9; i++){
    console.log(`\nBảng cửu chương ${i}:`);
    for (let j = 1; j <= 10; j++){
        console.log(`${i} x ${j} = ${i * j}`);
    }
}

// Bài 7: Khai báo số nguyên dương n. Tính tổng tất cả các chữ số của n.
    // Ví dụ: n = 123 => Tổng các chữ số = 1+2+3 = 6
n = 12345;
let sumDigits = 0;
let tempN = n; // Lưu giá trị ban đầu của n để in ra sau
while (tempN > 0){
    // Cộng số hàng đơn vị vào tổng
    sumDigits += tempN % 10;
    // Loại bỏ số hàng đơn vị
    tempN = Math.floor(tempN / 10);
}
console.log(`Tổng các chữ số của ${n}:`, sumDigits);

// Bài 8: Khai báo n là số giây cần chuyển đổi (số nguyên)
    // In ra màn hình dạng h-m-s
    // Ví dụ: 3661s = 1h 1p 1s
let time = 3661;
let hours = Math.floor(time / 3600);
let minutes = Math.floor((time % 3600) / 60);
let seconds = time % 60;
console.log(`${time}s = ${hours}h ${minutes}p ${seconds}s`);

// Bài 9: Danh sách
    // YC1: Nhập vào từ bàn phím 1 danh sách bao gồm 10 số nguyên
let numList = [9, 1, 5, 2, 10, 8, 4, 7, 6, 3];
console.log('Danh sách số nguyên:', numList);
    // YC2: Thêm số '-5' vào vị trí thứ 2 (index=2) trong danh sách
numList.splice(2, 0, -5);
console.log(numList);
    // YC3: Tính tổng các cố chẵn trong danh sách
let sumEven = 0;
for (let num of numList){
    if (num % 2 === 0) sumEven += num;
}
console.log('Tổng các số chẵn trong danh sách:', sumEven);
    // YC4: Đếm số lượng số lẻ có trong danh sách
countOdd = 0;
for (let num of numList){
    if (num % 2 !== 0) countOdd++;
}
console.log('Số lượng số lẻ trong danh sách:', countOdd);
    // YC5: Tìm giá trị phần tử lớn nhất của danh sách
let maxNum = Math.max(...numList);
console.log('Giá trị phần tử lớn nhất:', maxNum);
    // YC6: Tìm vị trí phần tử nhỏ nhất của danh sách
let minNum = Math.min(...numList);
let minIndex = numList.indexOf(minNum);
console.log('Vị trí phần tử nhỏ nhất:', minIndex);
    // YC7: Dùng hàm tính giá trị trung bình của các phần tử trong danh sách
function average(arr){
    let sum = 0;
    for (let num of arr){
        sum += num;
    }
    avg = sum / arr.length;
    return avg.toFixed(2);
}
console.log('Giá trị TB:', average(numList));

// Bài 10: Nhập vào từ bàn phím 1 chuỗi ký tự bao gồm các số nguyên, các số này cách nhau 1 khoảng trắng (hoặc dấu ,).
let str1 = "12 5 8 15 3 20 7 11 6 9";
    // Yêu cầu 1: Tách chuỗi và thêm vào danh sách có tên num_list
    // Yêu cầu 2: Chuyển đổi toàn bộ phần tử trong danh sách num_list thành kiểu dữ liệu int.
let num_list = str1.split(' ').map(Number);
console.log('Danh sách số nguyên:', num_list);
    // Yêu cầu 3: In ra màn hình số lượng số lẻ của num_list.
countOdd = 0;
for (let num of num_list){
    if (num % 2 !== 0) countOdd++;
}
console.log('Số lượng số lẻ trong num_list:', countOdd);
    // Yêu cầu 4: Sắp xếp các phần tử trong danh sách num_list theo thứ tự từ lớn đến nhỏ.
num_list.sort((a, b) => b - a);
console.log('num_list sau khi sắp xếp:', num_list);

// Bài 11: Dùng thư viên random để thêm ngẫu nhiên các số nguyên trong khoảng [20,50] vào 2 danh sách arr1 và arr2. 
function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let arr1 = [];
let arr2 = [];
for (let i = 0; i < 10; i++){
    arr1.push(getRandomInt(20, 50));
    arr2.push(getRandomInt(20, 50));
}
console.log('arr1:', arr1);
console.log('arr2:', arr2);
    // Yêu cầu 1: Hãy viết hàm/chương trình con in ra phần tử chung của 2 danh sách vừa tạo.
function printCommonElements(list1, list2){
    let common = [];
    for (let num of list1){
        if (list2.includes(num) && !common.includes(num)){
            common.push(num);
        }   
    }
    console.log('Phần tử chung của 2 danh sách:', common);
}
printCommonElements(arr1, arr2);
    // Yêu cầu 2: In ra màn hình vị trí phần tử nhỏ nhất của danh sách arr1
let minArr1 = Math.min(...arr1);
let minArr1Index = arr1.indexOf(minArr1);
console.log('Vị trí phần tử nhỏ nhất của arr1:', minArr1Index);
    // Yêu cầu 3: In ra màn hình vị trí phần tử lớn nhất của danh sách arr2
let maxArr2 = Math.max(...arr2);
let maxArr2Index = arr2.indexOf(maxArr2);
console.log('Vị trí phần tử lớn nhất của arr2:', maxArr2Index);

// Bài 12: khai báo biến họ tên của bạn.
name = 'bUi DuC tRUng';
    // Yêu cầu 1: Chuyển đổi chuỗi ký tự tên thành chuỗi ký tự viết hoa
let nameUpper = name.toUpperCase();
console.log('Viết hoa:', nameUpper);
    // Yêu cầu 2: Chuyển đổi chuỗi ký tự tên thành chuỗi ký tự viết thường
let nameLower = name.toLowerCase();
console.log('Viết thường:', nameLower);
    // Yêu cầu 3: Chuyển đổi chuỗi ký tự tên thành chuỗi ký tự viết hoa các chữ cái đầu
function capitalizeFirstLetter(str){
    let words = str.split(' ');
    for (let i = 0; i < words.length; i++){
        words[i] = words[i][0].toUpperCase() + words[i].slice(1).toLowerCase();
    }
    return words.join(' ');
}
let nameCapitalized = capitalizeFirstLetter(name);
console.log('Viết hoa chữ cái đầu:', nameCapitalized);