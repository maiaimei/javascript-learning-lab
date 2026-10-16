console.log("JavaScript 原始类型（Primitive Types）/值类型/基本类型示例");

console.log("-------------------- 字符串 --------------------");
var str1 = "Hello, World!"; // 字符串，不支持换行
var str2 = 'Hello, JavaScript!'; // 字符串，不支持换行
var str3 = `Hello, ES6!`; // 字符串（模板字符串），支持换行、支持 ${expression} 插值
var str4 = String(123); // 字符串（通过构造函数）
console.log(typeof str1, str1); // 输出: string Hello, World!
console.log(typeof str2, str2); // 输出: string Hello, JavaScript!
console.log(typeof str3, str3); // 输出: string Hello, ES6!
console.log(typeof str4, str4); // 输出: string 123

console.log("-------------------- 数字 --------------------");
var num1 = 42; // 数字
var num2 = 3.14; // 数字
var num3 = Number("123"); // 数字（通过构造函数）
console.log(typeof num1, num1); // 输出: number 42
console.log(typeof num2, num2); // 输出: number 3.14
console.log(typeof num3, num3); // 输出: number 123

console.log("-------------------- 布尔 --------------------");
var bool1 = true; // 布尔
var bool2 = false; // 布尔
var bool3 = Boolean(1); // 布尔（通过构造函数）
var bool4 = Boolean(0); // 布尔（通过构造函数）
console.log(typeof bool1, bool1); // 输出: boolean true
console.log(typeof bool2, bool2); // 输出: boolean false
console.log(typeof bool3, bool3); // 输出: boolean true
console.log(typeof bool4, bool4); // 输出: boolean false

console.log("-------------------- 空值和未定义 --------------------");
var nullValue = null; // 空
var undefinedValue; // 未定义
console.log(typeof nullValue, nullValue); // 输出: object null
console.log(typeof undefinedValue, undefinedValue); // 输出: undefined undefined

console.log(nullValue == null); // 输出: true
console.log(nullValue === null); // 输出: true
console.log(undefinedValue == undefined); // 输出: true
console.log(undefinedValue === undefined); // 输出: true
console.log(nullValue == undefinedValue); // 输出: true
console.log(nullValue === undefinedValue); // 输出: false

// 判空的最佳写法
// 同时判断 null 和 undefined
let value;
if (value == null) {
    // 等价于 value === null || value === undefined
}

console.log("-------------------- undefined 的常见产生场景 --------------------");

// 1. 声明但未赋值
let a;
console.log(typeof a); // 输出: undefined

// 2. 访问对象不存在的属性
const obj = {};
console.log(obj.name); // undefined

// 3. 函数参数未传递
function foo(b) {
    console.log(b);
}
foo(); // undefined

// 4. 函数无 return
function bar() {}
console.log(bar()); // undefined

// 5. 数组越界 / 稀疏数组
const arr = [1, , 3];
console.log(arr[1]); // undefined
console.log(arr[3]); // undefined

console.log("-------------------- null 的常见产生场景 --------------------");

// 1. 主动清空对象引用（最常见）
let user = { name: "Tom" };
user = null; // 明确表示：这个对象不再需要，有助于 GC（垃圾回收）

// 2. 初始化"将来会是对象"的变量，比 {} 或 undefined 更语义清晰
let currentUser = null;

// 3. 作为函数参数，表示"可选但为空"
function fetchUser(callback = null) {
    if (callback) callback();
}

console.log("-------------------- 符号 --------------------");
var sym1 = Symbol("desc"); // 符号
var sym2 = Symbol("desc"); // 符号
console.log(typeof sym1, sym1); // 输出: symbol Symbol(sym1)
console.log(typeof sym2, sym2); // 输出: symbol Symbol(sym2)
console.log(sym1 === sym2); // 输出: false
