// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects

// Math 的所有属性与方法都是静态的。
console.log(Math.PI);
// Math.abs(x) 函数返回一个数字的绝对值。
console.log(Math.abs(1.1)); // 1.1
console.log(Math.abs(-1.1)); // 1.1
// Math.floor() 函数总是返回小于等于一个给定数字的最大整数。
console.log(Math.floor(1.1)); // 1
console.log(Math.floor(1.9)); // 1
// Math.ceil() 静态方法总是向上舍入，并返回大于等于给定数字的最小整数。
console.log(Math.ceil(1.1)); // 2
console.log(Math.ceil(1.9)); // 2
// Math.round() 函数返回一个数字四舍五入后最接近的整数。
// 如果参数的小数部分大于 0.5，则舍入到相邻的绝对值更大的整数。
// 如果参数的小数部分小于 0.5，则舍入到相邻的绝对值更小的整数。
// 如果参数的小数部分恰好等于 0.5，则舍入到相邻的在正无穷（+∞）方向上的整数。
// 简单记就是：‌大于 0.5 进一位，小于 0.5 舍掉，等于 0.5 时正数向上、负数向“上”（即更接近 0 的那边）‌。
console.log(Math.round(1.1)); // 1
console.log(Math.round(1.5)); // 2
console.log(Math.round(1.9)); // 2
console.log(Math.round(-1.1)); // -1
console.log(Math.round(-1.5)); // -1
console.log(Math.round(-1.9)); // -2
// Math.random() 静态方法返回一个大于等于 0 且小于 1 的伪随机浮点数
console.log(Math.random());

// 创建一个 JavaScript Date 实例
// 创建一个新Date对象的唯一方法是通过new 操作符
// Date()构造函数有四种基本形式

// 创建数组的两种方式
// 方式一：字面量创建数组
var arr1 = []; // 创建空数组
var arr2 = [1, 2, 3]; // 创建非空数组，数组元素依次是1,2和3
// 方式二：new Array()创建数组
var arr3 = new Array(); // 创建空数组
var arr4 = new Array(2); //创建指定长度数组，这里数组长度是2
var arr5 = new Array(1, 2, 3); //相当于字面量创建数组[1,2,3]
// 检测是否为数组的两种方式
// 方式一：待检测对象 instanceof Array
console.log(arr1 instanceof Array);
// 方式二：Array.isArray(待检测对象)
console.log(Array.isArray(arr1));
