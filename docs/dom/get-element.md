# JavaScript 获取 DOM 元素

在 JavaScript 中，获取 DOM 元素是操作页面、实现交互的基础。根据选择条件（ID、类名、标签、CSS 选择器等），核心共 6 种获取方式，可分为**获取单个元素**与**获取元素集合**两大类。

> 补充前置知识：所有获取 DOM 的方法，都依赖 `document` 对象（当前 HTML 文档的入口）；部分方法也可以挂载到某个父元素下，实现**局部范围查找**，例如 `parentElement.querySelector('.child')`，缩小查询范围，提升性能。

## 一、获取单个元素（返回 Element 或 null）

**适用场景**：目标元素唯一，或只需要拿到匹配到的第一个元素。

### 1. `document.getElementById(id)`

```javascript
const el = document.getElementById('header');
```

- **特点**
  - 性能最高：浏览器内部通过哈希表直接查找，无需解析选择器，速度最快。
  - 唯一性约束：HTML 规范规定 `id` 在页面内应当唯一；若存在多个相同 id，仅返回文档中第一个匹配元素。
  - 返回值：匹配到的 `Element`；未匹配到返回 `null`。
- **适用场景**：精准定位带唯一 id 的元素，如页面主容器、核心按钮、弹窗根节点。
- **补充**：只支持在 `document` 上调用，不能挂载到普通元素上使用。

### 2. `document.querySelector(selector)`

```javascript
const el = document.querySelector('.btn-primary');
const firstInput = document.querySelector('form input[type="text"]');
```

- **特点**
  - 灵活强大：支持**所有 CSS 选择器**，id、类、标签、属性、伪类、后代选择器全部可用。
  - 只返回第一个：无论有多少匹配项，仅返回 DOM 树中第一个符合条件的元素。
  - 返回值：匹配到的 `Element`；未匹配到返回 `null`。
  - 支持局部查询：可以挂载到任意父元素，只在该父元素后代中查找。
- **适用场景**：现代 JS 开发单元素获取首选，适合复杂选择逻辑、不需要批量操作的情况。

## 二、获取元素集合（返回类数组对象）

**适用场景**：需要批量拿到一组元素。⚠️ 返回值均为**类数组（伪数组）**，不是真正的数组，不能直接使用 `map`、`filter` 等数组方法。

### 1. `document.getElementsByClassName(className)`

```javascript
const els = document.getElementsByClassName('item');
// 匹配同时拥有 box 和 active 两个类的元素
const multiClassEls = document.getElementsByClassName('box active');
```

- **特点**
  - 动态集合（Live）：返回 `HTMLCollection`。DOM 结构发生变化（新增、删除带该类名的元素）时，集合会自动更新。
  - 多类名：传入多个类名用空格分隔，表示同时具备这些类的元素。
  - 返回值：匹配到的 `HTMLCollection`；无匹配则返回空集合（length 为 0）。
- **适用场景**：需要实时跟随 DOM 变化，操作一批同类元素。

### 2. `document.getElementsByTagName(tagName)`

```javascript
const divs = document.getElementsByTagName('div');
// 获取页面全部元素
const allEls = document.getElementsByTagName('*');
```

- **特点**
  - 动态集合（Live）：返回 `HTMLCollection`，DOM 变化会自动同步到集合。
  - 支持通配符 `*`：可获取文档内所有元素。
  - 返回值：`HTMLCollection`；无匹配返回空集合。
- **适用场景**：批量处理某一类标签，例如重置所有 `input`、批量修改所有 `img` 属性。

### 3. `document.getElementsByName(name)`

```
const radios = document.getElementsByName('gender');
```

- **特点**
  - 表单场景专用：依据 `name` 属性匹配元素，多用于单选框、复选框、表单字段。
  - 动态集合：返回 `NodeList`，DOM 变化会同步更新集合。
  - 返回值：`NodeList`；无匹配返回空集合。
- **适用场景**：处理表单内一组同名表单控件，获取选中的单选/复选值。

### 4. `document.querySelectorAll(selector)`

```javascript
const items = document.querySelectorAll('.list .item');
```

- **特点**
  - 静态集合（Static）：返回 `NodeList`，属于快照。DOM 后续新增、删除元素，**不会**改变已经拿到的这个集合。
  - 支持全部 CSS 选择器，同样支持局部查询。
  - 原生支持 `forEach` 遍历（现代浏览器）。
  - 返回值：`NodeList`；无匹配返回空集合。
- **适用场景**：现代开发批量获取 DOM 的首选；适合不需要实时同步 DOM 的场景，遍历、操作更安全，不容易因为 DOM 变动出现索引错乱。

## 三、核心差异对比与选型指南

| 方法                     | 返回值类型       | 动态 / 静态 | 支持 CSS 选择器 | 未找到返回值 | 推荐指数 | 备注                                |
| ------------------------ | ---------------- | ----------- | --------------- | ------------ | -------- | ----------------------------------- |
| `getElementById`         | `Element`        | -           | ❌               | `null`       | ⭐⭐⭐⭐⭐    | id 查询性能最优，仅 `document` 可用 |
| `querySelector`          | `Element`        | -           | ✅               | `null`       | ⭐⭐⭐⭐⭐    | 单元素现代开发首选，支持局部查询    |
| `getElementsByClassName` | `HTMLCollection` | 动态        | ❌               | 空集合       | ⭐⭐⭐      | 需要实时同步 DOM 时选用             |
| `getElementsByTagName`   | `HTMLCollection` | 动态        | ❌               | 空集合       | ⭐⭐⭐      | 按标签批量获取，支持 `*` 通配       |
| `getElementsByName`      | `NodeList`       | 动态        | ❌               | 空集合       | ⭐⭐       | 仅推荐表单同名元素场景              |
| `querySelectorAll`       | `NodeList`       | 静态        | ✅               | 空集合       | ⭐⭐⭐⭐⭐    | 批量获取首选，遍历安全              |

## 四、避坑与最佳实践

### 1. 动态集合 vs 静态集合陷阱

- `getElementsByClassName`、`getElementsByTagName`、`getElementsByName` 返回动态集合。

  在循环遍历的同时修改 DOM（如删除节点），集合长度和内容会实时变化，极易造成元素跳过、死循环、索引异常。

  ```javascript
  // ❌ 危险示例：动态集合导致循环异常
  const items = document.getElementsByClassName('item');
  for (let i = 0; i < items.length; i++) {
    items[i].remove(); // 删除后集合长度变化，i 递增，会漏删元素
  }
  ```

- `querySelectorAll` 返回静态快照，遍历过程不受 DOM 改动影响，循环操作更安全。

### 2. 类数组转真数组

`HTMLCollection` 和 `NodeList` 不是数组，无法直接使用 `map`、`filter`、`reduce`。

```javascript
const nodeList = document.querySelectorAll('.item');
const htmlCollection = document.getElementsByClassName('item');

// 转为真数组的两种方式
const arr1 = Array.from(nodeList);
const arr2 = [...htmlCollection];
```

> 补充：`NodeList` 原生支持 `forEach`；`HTMLCollection` 不支持 `forEach`，需要转数组后再遍历。

### 3. 性能建议

1. 明确通过 id 获取元素，优先使用 `getElementById`，比 `querySelector('#id')` 更快，后者需要解析选择器字符串。

2. 尽量缩小查询范围：不要每次都从 `document` 全局查询，可以挂载到父元素上局部查找。

   ```javascript
   const list = document.getElementById('list');
   // 只在 list 内部查找，性能更好
   const items = list.querySelectorAll('.item');
   ```

3. 大型文档避免过于复杂的 CSS 选择器，会拖慢 `querySelector` / `querySelectorAll` 查询速度。

### 4. 现代开发推荐方案

- 获取单个元素：优先 `querySelector`
- 批量获取元素：优先 `querySelectorAll`
- 极致性能、老项目兼容：保留 `getElementById`、`getElementsByClassName`
- 表单同名元素：`getElementsByName`

## 五、额外补充：获取特殊节点（拓展知识点）

除了上面 6 种核心方法，还有常用获取文档特殊节点的属性，不属于“选择元素”但高频使用：

- `document.documentElement`：获取 `<html>` 根元素
- `document.head`：获取 `<head>` 元素
- `document.body`：获取 `<body>` 元素

