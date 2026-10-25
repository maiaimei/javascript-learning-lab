class 本质上是 JavaScript（JS） 的概念，不是 TypeScript（TS）独有的。

1️⃣ JS 中就有 class

从 ES6（ES2015） 开始，JavaScript 原生支持 "class" 语法：

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  sayHello() {
    console.log(`Hello, ${this.name}`);
  }
}
```

这只是语法糖，底层仍然是基于 JavaScript 的原型继承。

2️⃣ TS 是在 JS 的 class 基础上做增强

TypeScript 并没有发明 "class"，而是扩展了 JS 的 class，增加了：

- 类型注解
- 访问修饰符（"public"、"private"、"protected"、"readonly"）
- 抽象类（"abstract"）

```javascript
class Person {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  sayHello(): void {
    console.log(`Hello, ${this.name}`);
  }
}
```

3️⃣ 一句话总结

- ✅ "class" 是 JS 的概念
- ✅ TS 增强了 class 的能力
- ❌ 不是 TS 首创或 TS 专属