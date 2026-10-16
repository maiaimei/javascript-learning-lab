# DOM（文档对象模型）

## 一、DOM 基础概念

**DOM**（Document Object Model，文档对象模型）是 W3C 制定的标准接口，用于将 HTML 和 XML 文档表示为一个可编程的对象结构。

| 维度         | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| **全称**     | Document Object Model                                        |
| **制定者**   | W3C（万维网联盟）                                            |
| **本质**     | 跨平台、语言无关的**接口规范**，不绑定 JavaScript            |
| **核心思想** | 将文档解析为一棵**节点树**，程序可通过树形 API 访问、修改页面内容、结构和样式 |

> 💡 虽然 DOM 不是 JavaScript 独有的，但我们日常开发中几乎总是用 **JavaScript** 来操作 DOM，二者经常一起出现。

------

## 二、文档、节点、元素——从大到小的三层关系

理解 DOM 最关键的一步，就是理清这三个概念的**包含关系**：

```
文档（Document）  ← 整棵树的根
  └─ 节点（Node）  ← 树上的每一个点（全集）
       └─ 元素（Element）  ← 节点中最常用的一种（子集，即 HTML 标签）
```

### 1. 🌳 文档（Document）

- **是什么**：整个 HTML 页面，DOM 树的**根节点**。
- **怎么用**：在浏览器中通过全局对象 `document` 访问。
- **地位**：所有 DOM 操作的**起点**，比如 `document.getElementById()`。

### 2. 📦 节点（Node）——DOM 的基本单位

页面上**任何东西**都是节点，包括标签、文字、属性、注释，甚至空格和换行。

在 DOM 中，`nodeType` 是一个整数，用来表示节点类型。

| nodeType 值 | 常量名（Node 接口） | 含义 |
|:---:|:---|:---|
| 1 | `Node.ELEMENT_NODE` | 元素节点（如 `<div>`） |
| 2 | `Node.ATTRIBUTE_NODE` | 属性节点（已较少使用） |
| 3 | `Node.TEXT_NODE` | 文本节点 |
| 4 | `Node.CDATA_SECTION_NODE` | CDATA 节点 |
| 7 | `Node.PROCESSING_INSTRUCTION_NODE` | 处理指令节点 |
| 8 | `Node.COMMENT_NODE` | 注释节点 |
| 9 | `Node.DOCUMENT_NODE` | 文档节点 |
| 10 | `Node.DOCUMENT_TYPE_NODE` | 文档类型节点（如 `<!DOCTYPE html>`） |
| 11 | `Node.DOCUMENT_FRAGMENT_NODE` | 文档片段节点 |

示例
```javascript
document.nodeType;                    // 9
document.body.nodeType;               // 1
document.body.firstChild.nodeType;    // 可能是 3（文本）或 1（元素）
```

最权威的官方说明在 **MDN Web Docs**（Mozilla 维护，W3C/DOM 标准事实参考）：

- **MDN 中文**：https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
- **MDN 英文**：https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType

### 3. 🏷️ 元素（Element）——开发中最常打交道的对象

- **本质**：节点（Node）的一个**子集**，特指 HTML/XML 标签。
- 关键区别：
  - ✅ 所有元素**都是**节点
  - ❌ 但节点**不一定是**元素（比如文字、注释）
- 实际影响：
  - `parent.childNodes` → 返回**所有类型**的子节点（包含文本、注释等）
  - `parent.children` → 只返回**元素节点**（自动过滤空白文本，更省事 ✅）

### 4. ✅ 核心继承链（最重要）

```
EventTarget
  └── Node
        ├── Document        // 整个文档
        ├── CharacterData
        │     ├── Text      // 文本节点
        │     └── Comment   // 注释节点
        └── Element         // 元素节点（标签）
              ├── HTMLElement        // 所有 HTML 元素
              │     ├── HTMLDivElement
              │     ├── HTMLInputElement
              │     ├── HTMLAnchorElement
              │     └── ...
              └── SVGElement         // SVG 元素
```

一句话：

- **Node**：树里的任何东西
- **Element**：Node 里“是标签”的那部分
- **HTMLElement**：Element 里“是 HTML 标签”的那部分
- **HTMLInputElement**：某个具体 HTML 标签

**DOM API** = 通用文档模型

**HTML DOM API** = 浏览器对 HTML 页面额外加的一层

不需要记住所有接口，只要记住：

| 我想做的事              | 用哪一层            |
| ----------------------- | ------------------- |
| 遍历树 / 判断节点类型   | Node                |
| 操作标签、属性、class   | Element             |
| 操作 HTML 元素样式/状态 | HTMLElement         |
| 操作 input / a / img    | 具体 HTMLXxxElement |
| 查文档、建节点          | Document            |
| 学“HTML 相关 DOM”       | HTML DOM API        |

------

## 三、DOM 的常见使用场景

| 场景         | 典型操作      | 示例                                                         |
| ------------ | ------------- | ------------------------------------------------------------ |
| **内容修改** | 读写文本/HTML | `element.textContent`、`element.innerText`、`element.innerHTML` |
| **结构变更** | 增删改元素    | `document.createElement()`、`element.appendChild()`          |
| **样式控制** | 改 CSS        | `element.style.color = 'red'`、`element.classList`           |
| **事件处理** | 响应用户行为  | `button.addEventListener('click', handler)`                  |
| **表单交互** | 获取/验证输入 | `input.value`、`form.submit()`                               |
| **动态加载** | 按需渲染      | 结合 AJAX / Fetch 更新局部页面                               |

------

## 四、常见易混点 & 实用技巧

### ❓ 为什么 `childNodes` 里有很多"空文本节点"？

HTML 中标签之间的**空格、换行、缩进**都会被解析为**文本节点**。例如：

```html
<ul>
  <li>Item</li>
</ul>
```

`ul` 的 `childNodes` 会包含：换行文本节点 → `<li>` 元素节点 → 换行文本节点。

**解决方案**：用 `children` 只拿元素，或用 `Array.from(nodes).filter(n => n.nodeType === 1)` 手动过滤。

### ❓ `nodeType` 有什么用？

在遍历 DOM 树时，常用 `nodeType` 判断节点种类，避免误操作文本节点：

```javascript
for (let node of parent.childNodes) {
  if (node.nodeType === Node.ELEMENT_NODE) { // 1
    console.log('这是一个元素：', node.tagName);
  }
}
```

### ❓ 属性节点到底算不算"子节点"？

严格来说不算。`attributes` 是元素节点的**属性集合**，不是 `childNodes` 的一部分。访问方式：

```javascript
element.attributes          // 所有属性
element.getAttribute('src') // 获取特定属性
```

------

## 五、DOM 操作性能小贴士

1. **减少重排（Reflow）**：批量修改样式时用 `class` 切换代替逐条改 `style`。
2. **文档片段（DocumentFragment）**：离线操作节点，最后一次性插入 DOM。
3. **缓存访问结果**：避免重复 `getElementById` / `querySelector`。
4. **事件委托**：利用事件冒泡，把子元素事件绑定到父元素上，减少监听器数量。

------

## 六、参考与延伸阅读

- **MDN Web API 文档**：https://developer.mozilla.org/zh-CN/docs/Web/API
- **DOM 规范（W3C）**：https://www.w3.org/DOM/
- **推荐学习路径**：DOM 基础 → 事件机制 → 性能优化 → 虚拟 DOM（如 React/Vue 中的概念）



