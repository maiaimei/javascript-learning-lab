# JavaScript的对象模型 - 原型

JavaScript 的对象模型是基于原型的，而不是基于更常见的类。

JS 里**没有传统意义上的“类作为对象蓝图的模板”**，对象不是被“类实例化”出来的，而是**直接克隆/关联到另一个现成对象（原型）**，属性查找时顺着一条“原型链”往上找。

------

## 1. 传统“类模型”是怎么想的

在 Java / C++ / Python 里：

```java
class Dog { void bark() {...} }
Dog d = new Dog();   // d 是 Dog 类这个“模具”倒出来的实例
```

- **类是第一等公民**，先有类，再有实例
- 方法写在类里，`d` 自己身上并不存 `bark`，调用时由运行时去类的结构里找
- 继承是“类继承类”（`class Cat extends Animal`）

------

## 2. JS 的“原型模型”实际在做什么

JS 里**对象直接挂到另一个对象上**：

```javascript
const dogProto = {
  bark() { console.log("wang~"); }
};

// 创建一个新对象，让它内部的 [[Prototype]] 指向 dogProto
const d = Object.create(dogProto);

d.bark(); // "wang~"
```

关键点：

- `d` 自己身上**根本没有 `bark` 这个函数**
- 访问 `d.bark` 时，JS 发现 `d` 没有 → 顺着 `d.__proto__`（即 `dogProto`）找 → 找到了就调用
- 这条链就是**原型链**：`d → dogProto → Object.prototype → null`

> 所谓“基于原型”，就是**复用和继承靠的是对象之间的链接，而不是类之间的声明**。

------

## 3. `class` 只是语法糖，不是新模型

很多人会被下面的写法骗到：

```javascript
class Dog {
  bark() { console.log("wang~"); }
}
const d = new Dog();
```

这**看起来像类语言**，但底层依然是原型链：

- `Dog` 本质是个函数（构造函数）
- `Dog.prototype` 就是那个被挂到实例 `__proto__` 上的对象
- `class Dog extends Animal` 只是在偷偷设置 `Dog.prototype.__proto__ = Animal.prototype`

可以用一行验证：

```javascript
console.log(d.__proto__ === Dog.prototype); // true
```

------

## 4. 用一张小对照表收一下

| 维度       | 类模型（Java 等） | 原型模型（JS）                         |
| ---------- | ----------------- | -------------------------------------- |
| 复用单位   | 类                | 对象（原型对象）                       |
| 实例来源   | `new 类()`        | `Object.create(原型)` / `new 构造函数` |
| 方法存哪   | 类的结构里        | 原型对象上                             |
| 继承本质   | 类继承类          | 原型对象链到另一个原型对象             |
| 运行时查找 | 查类结构          | 沿 `__proto__` 链查找                  |

`__proto__` 可以理解为：**每个对象身上偷偷挂着的一根“线”，指向它的原型对象**，JS 靠这根线去“借”自己没有的属性或方法。

------

# \__proto__

## 1. 它到底是什么

- 正式名字叫对象的 **`[[Prototype]]` 内部槽**（规范里的隐藏字段）
- `__proto__` 是浏览器/引擎早期暴露出来的**访问器属性**，用来读写这个内部槽
- 它**不是对象自己的普通属性**，而是存在 `Object.prototype` 上的 getter/setter

```javascript
const obj = {};
console.log(obj.__proto__ === Object.prototype); // true
```

> 注意：`__proto__` 已不推荐在新代码里直接用，标准写法是 `Object.getPrototypeOf(obj)` / `Object.setPrototypeOf(obj)`。但理解原型链时它最直观，所以大家都还在用。

------

## 2. 它干的唯一一件事：属性查找时“顺藤摸瓜”

当访问 `obj.xxx` 时，JS 的查找顺序：

1. 先看 `obj` 自己有没有 `xxx`
2. 没有 → 去 `obj.__proto__` 里找
3. 还没有 → 再往 `obj.__proto__.__proto__` 找
4. 一直到 `null` 还没找到 → 返回 `undefined`

```javascript
const animal = { eat() { console.log("eat~"); } };
const dog = Object.create(animal);

dog.eat();        // eat~
console.log(dog.__proto__ === animal); // true
console.log(animal.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null
```

链条长这样：

```
dog → animal → Object.prototype → null
   ↑__proto__   ↑__proto__          ↑__proto__
```

`dog` 自己根本没有 `eat`，全靠 `__proto__` 这根线借来的。

------

## 3. 它和 `prototype` 别搞混（高频坑）

这是初学者最容易晕的地方，直接对照：

| 东西        | 谁有             | 作用                                             |
| ----------- | ---------------- | ------------------------------------------------ |
| `__proto__` | **所有对象**都有 | 指向“我找属性时去问谁”                           |
| `prototype` | **只有函数**才有 | 构造函数 `new` 出来的实例的 `__proto__` 会指向它 |

```javascript
function Dog() {}
const d = new Dog();

d.__proto__ === Dog.prototype;     // true  ← 实例的线指向构造函数的prototype
Dog.prototype.__proto__ === Object.prototype; // true
Dog.__proto__ === Function.prototype; // true ← 函数本身也是对象
```

一句话记死：

> **`prototype` 是“模具上贴的说明书”，`__proto__` 是“实例手里攥着的说明书地址”。**

------

## 4. 几个直观小实验

```javascript
// 1. 改 __proto__ 真的会改变查找结果
const a = { say: () => console.log("A") };
const b = {};
b.__proto__ = a;
b.say(); // A

// 2. 字面量对象的默认线
({}).__proto__ === Object.prototype;        // true
([]).__proto__ === Array.prototype;         // true
(function(){}).__proto__ === Function.prototype; // true

// 3. 标准写法（推荐替代 __proto__）
Object.getPrototypeOf(b) === a;             // true
```

------

## 5. 一句话总结

`__proto__` 就是对象用来**指向上一个原型对象的引用**，整条原型链就是靠一堆 `__proto__` 串起来的；它本身不参与存数据，只负责“找不到时去问谁”。

