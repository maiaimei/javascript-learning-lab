# javascript-learning-lab
JavaScript learning repository: core language concepts, modern ES6+ features, popular frameworks and common libraries practice samples.
## ECMAScript

ES规范就是ECMAScript规范，它是JavaScript语言的国际标准化规范，由Ecma International通过ECMA-262标准制定和维护。

📜 核心概念

1. 什么是ES：ECMAScript（简称ES）是JavaScript的底层语言规范，定义了语法、类型、语句、对象模型等核心内容。日常写的JS代码都基于ES规范实现。
2. 与JavaScript的关系：JavaScript是基于ECMAScript规范的脚本语言实现，两者是“规范”与“实现”的关系。
3. 与W3C的区别：W3C管“页面长什么样”（HTML/CSS），ES管“页面如何工作”（JS逻辑）。

🔄 版本演进

ES规范从2015年起改为每年发布一个新版本，用“年份+版本号”命名：

| 版本 | 年份 | 代表特性 |
|------|------|---------|
| ES6 (ES2015) | 2015 | let/const、箭头函数、class、Promise、模块化 |
| ES11 (ES2020) | 2020 | 空值合并操作符`??`、可选链`?.` |
| ES15 (ES2024) | 2024 | Map.groupBy()、Promise.withResolvers()、RegExp v标志 |
| ES16 (ES2025) | 2025 | Promise.try、Set集合运算方法、JSON模块直接导入 |
| ES17 (ES2026) | 2026 | Math.sumPrecise、Iterator.concat、Array.fromAsync |

最新的ECMAScript 2026已于2026年6月30日正式获批，这是第17版规范。

🔍 官方入口

- TC39官网（提案与规范文档）：[tc39.es](https://tc39.es/)
- ECMA-262标准文档：[ecma-international.org](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/)

💡 实用建议

- 日常开发：目前ES6+已成为前端项目的默认语法标准，Vue、React、Webpack等现代工程体系均基于此。
- 兼容性处理：新特性存在浏览器兼容问题，生产环境建议用Babel转译成ES5，可通过`@babel/preset-env`统一处理。
- 学习路径：想深入理解规范细节，可先掌握ES6基础（let/const、箭头函数、解构、模块化），再按版本增量学习新特性。

## Reference

[https://developer.mozilla.org/zh-CN/docs/Web/API](https://developer.mozilla.org/zh-CN/docs/Web/API)

[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide)

[https://www.runoob.com/js/js-tutorial.html](https://www.runoob.com/js/js-tutorial.html)
