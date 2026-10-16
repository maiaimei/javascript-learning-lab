# JavaScript 变量声明

在 JavaScript 中，可以使用 **var**、**let** 和 **const** 三种关键字来声明变量。它们的特性和使用场景各不相同：

| **特性**       | **var**                        | **let**            | **const**              |
| :------------- | :----------------------------- | :----------------- | :--------------------- |
| **引入版本**       | 1997（ES1）                    | **ES2015（ES6）**  | **ES2015（ES6）**      |
| **作用域**         | 函数作用域                     | 块级作用域         | 块级作用域             |
| **是否必须初始化** | ❌ 否                           | ❌ 否               | ✅ 必须                 |
| **是否可重复声明** | ✅ 允许                         | ❌ 不允许           | ❌ 不允许               |
| **是否可重新赋值** | ✅ 可以                         | ✅ 可以             | ❌ 不可以（引用不可变） |
| **变量提升**       | ✅ 有（会初始化为 `undefined`） | ✅ 有（但存在 TDZ） | ✅ 有（但存在 TDZ）     |
| **暂时性死区（TDZ）**     | ❌ 无                           | ✅ 有               | ✅ 有                   |
| **挂载到全局对象**   | ✅ 挂载到 `window`              | ❌ 不挂载           | ❌ 不挂载               |

## 使用建议

1. **优先使用 `const`**：默认使用 `const` 声明变量，确保变量不会被意外修改。
2. **需要重新赋值时使用 `let`**：仅在需要重新赋值的情况下使用 `let`。
3. **避免使用 `var`**：`var` 存在变量提升和作用域问题，容易导致意外行为。

## 作用域差异

### 规则

- **`var`**：**函数作用域**，变量的存活范围 = 声明它的最内层函数体。`if` / `for` / `while` / 裸 `{}` 都拦不住它，函数内任意位置均可访问；函数执行结束，变量随即销毁；作用域边界是 `function` 的花括号，不是任意 `{}`。
- **`let` / `const`**：**块级作用域**，变量的存活范围 = 声明它的最内层 `{}` 代码块。可以是 `if`、`for`、`while`、switch，甚至独立的 `{ }`。出了这层 `{}` 立刻不可访问，且访问前处于暂时性死区（TDZ）。任何 `{}` 都是一道边界，变量生命周期严格锁死在这个块内。

### 示例

```javascript
function fn() {
    if (true) {
        var a = 1; // 看起来在 if 里，其实还是 fn 的变量
        let b = 2;
        const c = 3;

        console.log(a, b, c); // 1 2 3
    }
    console.log(a); // 1
    console.log(b); // ReferenceError: b is not defined
    console.log(c); // ReferenceError: c is not defined
}
fn();
```

解析：

- `var a` 提升到函数作用域，块外仍可访问。
- `let b` / `const c` 仅存活于 `if` 块内，块外访问即抛 `ReferenceError`。

## 重复声明

### 规则

- **`var`**：同一作用域内允许重复声明。
- **`let` / `const`**：同一作用域内禁止重复声明，抛 `SyntaxError`。

### 示例

```javascript
// var ✅
var a = 1;
var a = 2;

// let ❌
let b = 1;
let b = 2; // SyntaxError: Identifier 'b' has already been declared

// const ❌
const c = 1;
const c = 2; // SyntaxError: Identifier 'c' has already been declared
```

## 重新赋值

### 规则

- **`var` / `let`**：可重新赋值。
- **`const`**：不可重新赋值；若值为对象，**引用地址不可变，但对象内部属性可修改**。

### 示例

```javascript
var a = 1; a = 2;        // ✅
let b = 1; b = 2;        // ✅

const c = 1;
c = 2;                   // ❌ TypeError: Assignment to constant variable.

const obj = { name: 'Tom' };
obj.name = 'Jerry';       // ✅ 修改属性
obj = {};                 // ❌ 修改引用地址
```

## 变量提升与暂时性死区（TDZ）

**变量提升**：代码正式执行前，JS 引擎会先扫描当前作用域，把 `var`/`function` 的声明（以及 `let`/`const` 的变量绑定）统一提到作用域顶部，但只“只挪声明，不挪赋值”，等到真正执行到赋值语句时才补上具体的值。

### 规则

- **`var`**：声明提升，初始化前值为 `undefined`。
- **`let` / `const`**：声明同样提升，但**初始化前不可访问**，这段区域称为 **暂时性死区（Temporal Dead Zone, TDZ）**，是 `let`/`const` 的关键安全机制。

### 示例

#### `var` 声明提升

```javascript
console.log(x); // undefined  ← 没报错！
var x = 10;
```

引擎实际干的事相当于：

```javascript
var x;        	// 声明被“提升”到顶部
console.log(x); // undefined（有声明没赋值）
x = 10;       	// 赋值留在原处
```

#### `let` 声明提升

```javascript
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;
```

引擎实际干的事相当于：

```javascript
let y;
console.log(y); // ReferenceError: Cannot access 'y' before initialization
y = 10;
```

#### 函数声明提升

```javascript
foo(); // ✅ 直接能跑
function foo() {
    console.log('hi');
}
```

函数声明会把**整个函数体**一起提升上去，所以调用写在前面也能跑。

但函数表达式不行：

```javascript
bar(); // ❌ TypeError: bar is not a function
var bar = function () { console.log('hi'); };
```

引擎实际干的事相当于：

```javascript
var bar;
bar(); // ❌ TypeError: bar is not a function
bar = function () { console.log('hi'); };
```

## 循环中的异步陷阱（经典面试题）

### `var` 的问题

```javascript
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0); // 3 3 3
}
```

**原因**：`var i` 被提升到外层作用域，三个回调共享同一个 `i`，等宏任务执行时循环已结束，`i === 3`。

### `let` 的修复

```javascript
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0); // 0 1 2
}
```

**原因**：`let` 在每次迭代中创建独立的块级绑定，回调各自捕获当次循环的 `i`。

## 全局对象挂载行为

### 规则

- **`var`**：全局声明会挂载到全局对象（浏览器中为 `window`）。
- **`let` / `const`**：全局声明仅存在于词法环境，**不会成为 `window` 的属性**。

### 示例

```javascript
var a = 1;
console.log(window.a); // 1

let b = 2;
console.log(window.b); // undefined
```

解析：

- `var` 的全局变量会污染全局对象；`let`/`const` 避免了这一副作用，更适合模块化开发。

# JavaScript 数据类型

JS 中**原始类型（Primitive Types） = 基本类型 = 值类型**（共 7 种），其余皆为**引用类型（对象类型）**。

ECMAScript 标准定义的 **7 种原始类型**：

| **原始类型（基本类型/值类型）** | **说明**         | **示例**            |
| :------------------------------ | :--------------- | :------------------ |
| `String`                        | 字符串           | `"hello"`           |
| `Number`                        | 数值             | `42`, `3.14`        |
| `BigInt`                        | 任意精度整数     | `9007199254740991n` |
| `Boolean`                       | 布尔值           | `true` / `false`    |
| `Undefined`                     | 未定义           | `undefined`         |
| `Null`                          | 空值             | `null`              |
| `Symbol`                        | 唯一且不可变的值 | `Symbol('id')`      |

**引用数据类型（对象类型）**：对象(Object)、数组(Array)、函数(Function)，还有两个特殊的对象：正则（RegExp）和日期（Date）。

| **分类**                   | **核心特征**               | **存储/比较方式**             |
| :------------------------- | :------------------------- | :---------------------------- |
| **值类型** （7种原始类型） | 不可变、无方法（自动包装） | 栈内存 / **按值**存储与比较   |
| **引用类型** （对象类型）  | 可变、键值对/引用          | 堆内存 / **按引用**存储与比较 |

## 字符串（String）

JavaScript 的**模板字符串 / 模板字面量（template literals）**是在 **ES2015（也就是 ES6）** 中正式引入的，规范于 **2015 年 6 月**定稿。

关键点：

- 早期叫 **template strings（模板字符串）**
- 后来规范里叫 **template literals（模板字面量）**
- 语法：用反引号 \`  包裹，支持 `${expression}` 插值、多行字符串、标签模板
- 浏览器支持：现代浏览器从 2015 年左右开始支持；**IE 不支持**
- 老环境要用 Babel 等工具转成 ES5

简单记：

> **ES5 及以前：没有模板字符串**
>
> **ES6 / ES2015：引入模板字符串**

## 大整数（BigInt）

- **引入版本**：ES2020（ES11）。
- **作用**：用于表示**任意精度的整数**。普通 `Number` 类型的安全整数范围是 `-(2^53 - 1)` 到 `2^53 - 1`，超过这个范围会丢失精度；而 `BigInt` 可以安全地表示超大整数（比如在密码学、大数据库 ID 等场景）。
- **用法**：在数字后面加 `n`，如 `9007199254740993n`。
- **注意**：`BigInt` 和 `Number` 不能直接混合运算，需要显式转换。

## 未定义（Undefined）/ 空（Null）

| **维度** | **undefined**                                      | **null**                                           |
| :------- | :------------------------------------------------- | :------------------------------------------------- |
| 语义     | 未初始化 / 未定义 / 不存在，表示"这个值目前不存在" | 空值 / 有意置空 / 已置空，表示"这个值存在，但为空" |
| 谁产生   | JS 引擎自动赋值                                    | 开发者手动/主动赋值                                |
| typeof   | `"undefined"`                                      | `"object"`                                         |
| JSON 中  | ✅ 会被忽略                                         | ✅ 会保留                                           |
| 转数字   | `NaN`                                              | `0`                                                |
| 推荐程度 | ❌ 不建议主动用                                     | ✅ 推荐用来表示空                                   |

undefined 表示"还没给"，null 表示"给了，但就是空"。

undefined 是 JS 的"默认缺席"，null 是开发者的"主动清空"。

注意：`typeof null === "object"` 是历史 Bug，但它本质是原始类型。

## Symbol

Symbol 是 **ES2015（ES6）** 引入了一种新的原始数据类型，表示独一无二的值。

Symbol 的核心价值：创建唯一、不可变、不可枚举的标识符。

Symbol 不是为了存数据，而是为了给“属性名”上一把不会撞车的锁。

- 第七种原始类型（Primitive）
- 每次调用都返回**全新且唯一的值**
- 描述（description）仅用于调试，不影响唯一性
- 常用于对象属性键

## 伪数组

伪数组就是“长得像数组，但并不是真数组”的对象——它有 `length` 属性和数字索引，能通过下标取值，但没法直接用 `push`、`forEach` 这些数组方法。

🧠 核心特征
1. 有索引和长度：能通过 `arr` 取值，也有 `length` 属性，看起来和数组一样。
2. 不是 Array 类型：它的原型链上没有 `Array.prototype`，所以 `Array.isArray()` 返回 `false`，本质是个普通对象。
3. 不能直接用数组方法：调用 `forEach`、`push` 会直接报错，因为没有这些方法。

> 简单理解：伪数组就像一个“仿冒品”，外形和真数组几乎一样，但内部构造不同——它没有继承数组的原型链，所以用不了数组自带的方法。

📌 常见伪数组
- arguments：函数内部获取所有参数的对象。
- DOM 集合：`document.getElementsByTagName()` 返回的 `HTMLCollection`、`document.querySelectorAll()` 返回的 `NodeList`（部分现代浏览器已支持 `forEach`，但仍是伪数组）。
- 字符串：也能按索引访问字符并带 `length`，但严格来说它属于原始类型，处理方式略有不同。

🔄 转为真数组
最常用两种方式：
1. ES6 的 `Array.from()`：`let arr = Array.from(伪数组)`，最推荐，简洁直观。
2. 扩展运算符：`let arr = [...伪数组]`，同样好用，但注意它不能展开没有 `Symbol.iterator` 的伪数组（比如 `arguments` 在部分老环境下可能不支持）。

其他方法如 `Array.prototype.slice.call()` 也能转，但写法稍旧，现在基本用 `Array.from` 就够了。

⚠️ 注意
`length` 是只读的，不能通过修改它来增删元素；遍历时用 `for` 循环没问题，但别直接调数组方法，转成真数组再操作最省心。