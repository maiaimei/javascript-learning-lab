# CSS 选择器

`document.querySelector()` 是 JavaScript 中用于从 DOM（文档对象模型）中检索元素的核心方法之一。它接收一个**CSS 选择器字符**作为参数，并返回文档中匹配该选择器**第一个**元素；如果没有找到匹配项，则返回 `null`。

> **重要区分**：`querySelector` 系列方法**仅支持 CSS 选择器语法**，不支持 XPath 或 jQuery 特有的 Sizzle 选择器扩展。

以下是 `document.querySelector()` 支持的主要选择器类型及具体用法：

## 基础选择器

### ID 选择器 (#id)

通过元素的 id 属性查找唯一元素。

```javascript
// 查找 id 为 "header" 的元素
const header = document.querySelector('#header');
```

### 类选择器 (.class)

查找具有指定 class 名的第一个元素。

```javascript
// 查找第一个 class 包含 "btn-primary" 的元素
const btn = document.querySelector('.btn-primary');
```

### 标签选择器 (tag)

查找指定标签名的第一个元素。

```javascript
// 查找页面中的第一个 <img> 标签
const firstImg = document.querySelector('img');
// 查找第一个 <div> 标签
const firstDiv = document.querySelector('div');
```

## 组合与层级选择器

### 后代选择器 (ancestor descendant)

查找某个元素内部的所有后代元素中的第一个匹配项。

```javascript
// 查找 .container 内部的第一个 .text 元素
const text = document.querySelector('.container .text');
```

### 子代选择器 (parent > child)

查找直接子元素（仅一级深度）。

```javascript
// 查找 ul.menu 下的第一个直接子元素 li.active
const item = document.querySelector('ul.menu > li.active');
```

### 相邻兄弟选择器 (prev + next)

查找紧接在另一个元素后的**第一个**元素。

```javascript
// 查找紧跟在 h1 后面的第一个 p 元素
const paragraph = document.querySelector('h1 + p');
```

### 通用兄弟选择器 (`prev ~ siblings`)

查找某元素**之后所有同级**的指定元素中的第一个匹配项。

```javascript
// 查找 .intro 之后所有同级 p 元素中的第一个
const siblingP = document.querySelector('.intro ~ p');
```

## 属性选择器

可以根据元素的属性及其值进行匹配，支持多种匹配模式：

| **模式**         | **含义**                               | **示例**                  |
| :--------------- | :------------------------------------- | :------------------------ |
| `[attr]`         | 存在该属性                             | `input[disabled]`         |
| `[attr="val"]`   | 属性值完全等于                         | `a[target="_blank"]`      |
| `[attr~="val"]`  | 属性值是以空格分隔的列表，其中包含 val | `.class1[title~="hello"]` |
| `[attr\|="val"]` | 属性值等于 val 或以 val- 开头          | `p[lang\|="en"]`          |
| `[attr^="val"]`  | 属性值以 val 开头                      | `a[href^="https"]`        |
| `[attr$="val"]`  | 属性值以 val 结尾                      | `img[src$=".png"]`        |
| `[attr*="val"]`  | 属性值包含 val 子串                    | `a[href*="example"]`      |

```javascript
// 查找第一个带有 target="_blank" 属性的 <a> 标签
const link = document.querySelector('a[target="_blank"]');

// 查找第一个 type 为 "text" 的 input 元素
const input = document.querySelector('input[type="text"]');

// 查找 href 以 "https" 开头的链接
const secureLink = document.querySelector('a[href^="https"]');

// 查找 src 以 ".png" 结尾的图片
const pngImg = document.querySelector('img[src$=".png"]');
```

## 伪类选择器

支持常用的 CSS 伪类，用于根据元素的状态或位置进行选择。

**状态伪类**：`:hover`, `:focus`, `:checked`, `:disabled`, `:enabled`, `:required`, `:optional`, `:valid`, `:invalid` 等。

**结构伪类**：`:first-child`, `:last-child`, `:nth-child(n)`, `:nth-last-child(n)`, `:first-of-type`, `:last-of-type`, `:nth-of-type(n)`, `:only-child`, `:only-of-type`, `:empty`, `:root`, `:not()` 等。

```javascript
// 查找同层级中的第一个 <input> 元素
const firstInput = document.querySelector('input:first-of-type');

// 查找列表中的最后一个 <li> 元素
const lastItem = document.querySelector('ul li:last-child');

// 查找被选中的复选框
const checkedBox = document.querySelector('input[type="checkbox"]:checked');

// 查找第 2n（偶数）个 <li>
const evenItem = document.querySelector('li:nth-child(2n)');

// 查找不包含 .active 类的按钮
const inactiveBtn = document.querySelector('button:not(.active)');

// 查找空元素
const emptyEl = document.querySelector('div:empty');
```

> **⚠️ 伪元素不可选**：`querySelector` **无法选中** CSS 伪元素（`::before`、`::after`、`::first-line`、`::first-letter`、`::selection` 等）。伪元素不是 DOM 树的一部分，无法通过 JS 直接获取。

## 分组选择器

可以使用逗号分隔多个选择器，返回匹配其中**任意一个**选择器的第一个元素（按照文档顺序）。

```javascript
// 返回文档中第一个出现的 h1 或 .subtitle 元素
const title = document.querySelector('h1, .subtitle');
```

## 使用注意事项

**只返回第一个匹配项**：即使有多个元素符合选择器条件，`querySelector()` 也只会返回文档流中出现**第一个**元素。如果需要获取**所有**匹配的元素，请使用 `document.querySelectorAll()`。

```javascript
// 只返回第一个 .item
const firstItem = document.querySelector('.item');
// 返回所有 .item（NodeList）
const allItems = document.querySelectorAll('.item');
```

**返回值可能为 null**：如果文档中没有匹配的元素，该方法返回 `null`。在操作返回的元素之前，建议先进行非空判断，以避免报错。

```javascript
const element = document.querySelector('#nonExistent');
if (element) {
    element.style.color = 'red';
}
```

**作用域灵活**：`querySelector()` 不仅可以在 document 上调用，也可以在任何 Element 节点上调用，此时它将在该元素的子节点范围内进行搜索（不包含该元素自身）。

```javascript
const container = document.querySelector('.container');
// 仅在 .container 内部查找 .item（不包含 .container 自身）
const item = container.querySelector('.item');
```

**性能考量**：虽然 `querySelector()` 功能强大且语法简洁，但在极高性能要求的场景下（如频繁循环查询），传统的 `getElementById()` 通常速度更快，因为它是直接通过哈希表查找。对于简单的 ID 查询，优先推荐使用 `getElementById()`。

```javascript
// ✅ 推荐：O(1) 哈希查找，性能最优
const el = document.getElementById('myId');

// ⚠️ 可行但较慢：需解析选择器字符串 + 遍历匹配
const el2 = document.querySelector('#myId');
```

## 返回值集合类型差异（关键）

| **方法**                   | **返回值**             | **集合类型**   | **动态/静态** |
| :------------------------- | :--------------------- | :------------- | :------------ |
| `getElementById()`         | 单个 Element 或 `null` | —              | —             |
| `getElementsByClassName()` | `HTMLCollection`       | 动态（Live）   | 动态          |
| `getElementsByTagName()`   | `HTMLCollection`       | 动态（Live）   | 动态          |
| `querySelector()`          | 单个 Element 或 `null` | —              | —             |
| `querySelectorAll()`       | `NodeList`             | 静态（Static） | 静态          |

**动态集合（Live）**：DOM 变化后自动更新，可能包含新添加的元素。

**静态集合（Static）**：快照，DOM 后续变化不影响已获取的集合。

```javascript
const container = document.querySelector('.container');

// 动态集合：DOM 变化后自动反映
const liveItems = container.getElementsByClassName('item');
// 静态集合：获取时的快照
const staticItems = container.querySelectorAll('.item');

// 向 DOM 添加新元素后
container.appendChild(document.createElement('div')).className = 'item';

console.log(liveItems.length);   // 增加 1（动态更新）
console.log(staticItems.length); // 不变（静态快照）
```

