# DOM事件核心知识点笔记
## 一、什么是DOM事件
DOM事件是前端实现交互的核心机制，它是**用户操作**或**浏览器行为**触发的特定动作，比如点击按钮、键盘输入、页面滚动、窗口大小改变、资源加载完成等。
通过监听这些事件并绑定处理函数，就能让静态页面动态响应用户操作，实现丰富的交互效果。
> 补充：事件本质是一种**观察者模式**，浏览器作为事件发布者，开发者注册的回调函数作为订阅者。

## 二、事件三要素
1. **事件源**：触发事件的DOM元素，也就是事件发生的目标位置，比如被点击的按钮、输入文字的输入框。
    - 可通过 `event.target` 获取**原始事件源**（实际触发元素）
    - 通过 `event.currentTarget` 获取**绑定事件的当前元素**（见事件对象章节）
2. **事件类型**：定义了触发事件的交互类型，常见分类：
    - 鼠标事件：`click`、`dblclick`、`mousedown`、`mouseup`、`mousemove`、`mouseover`、`mouseout`
    - 键盘事件：`keydown`、`keyup`、`keypress`
    - 表单事件：`submit`、`focus`、`blur`、`change`、`input`
    - 窗口/文档事件：`load`、`DOMContentLoaded`、`resize`、`scroll`、`unload`
    - 剪贴板事件：`copy`、`cut`、`paste`
    - 触摸事件（移动端）：`touchstart`、`touchmove`、`touchend`
3. **事件处理程序**：事件触发后自动执行的回调函数，函数接收一个**事件对象event**作为参数，内部可以编写任意交互逻辑，比如修改页面样式、提交表单数据、操作DOM等。

## 三、事件注册/绑定的三种方式
| 绑定方式 | 实现方式 | 优缺点 |
| ---- | ---- | ---- |
| HTML内联属性 | 直接在标签上写 `onclick="handleClick()"` | 优点：简单直观，上手快；<br>缺点：HTML和JS强耦合，违反结构与行为分离原则；只能绑定一个处理函数；存在作用域问题；现代开发**不推荐使用** |
| DOM0级属性绑定 | 通过JS给元素的事件属性赋值：`btn.onclick = function(){}` | 优点：实现结构和行为分离，兼容性好；<br>缺点：同一事件只能绑定一个处理函数，后面的赋值会覆盖前面的；无法精确控制捕获/冒泡阶段 |
| DOM2级 `addEventListener`（推荐） | `btn.addEventListener('click', handler, false)`<br>第三个参数：布尔值或对象（见补充） | 优点：支持同一事件绑定多个处理函数；可控制在捕获/冒泡阶段触发；支持精确移除事件；是标准事件绑定方式；<br>缺点：IE8及以下不支持（可用 `attachEvent` 兼容，但已淘汰） |

> 补充：`addEventListener` 第三个参数详解
> - 布尔值：`false`（默认）= 在**冒泡阶段**触发；`true` = 在**捕获阶段**触发
> - 可选对象参数：`{ capture: false, once: false, passive: false }`
>   - `once: true`：事件只触发一次，触发后自动移除
>   - `passive: true`：告知浏览器事件处理程序不会调用 `preventDefault()`，可优化滚动性能（如 `touchmove`、`wheel` 事件）

## 四、IE旧版事件模型（attachEvent / detachEvent，历史兼容方案）

⚠️ 仅支持 IE6 ~ IE8，现代浏览器已全部废弃，**新项目严禁使用**，仅作为 DOM 事件发展史的学习知识点。

### 1、API 语法

```javascript
// 注册事件（事件名必须带 on 前缀）
element.attachEvent('on' + eventType, callback);

// 移除事件
element.detachEvent('on' + eventType, callback);
```

### 2、与 addEventListener 核心差异

| **对比维度**         | **attachEvent（IE8-）**     | **addEventListener（标准）** |
| :------------------- | :-------------------------- | :--------------------------- |
| 事件名格式           | 必须带 `on`（如 `onclick`） | 不带 `on`（如 `click`）      |
| 回调函数 `this` 指向 | 指向 `window`，而非元素本身 | 指向绑定事件的 DOM 元素      |
| 多个监听器执行顺序   | 后绑定的先执行（逆序）      | 按绑定顺序依次执行           |
| 重复绑定同名函数     | 会重复触发执行              | 相同函数引用仅生效一次       |
| 浏览器支持           | IE6 ~ IE8                   | IE9+ 及所有现代浏览器        |

### 3、基础使用示例

```javascript
var btn = document.getElementById('btn');

function handleClick() {
  // ⚠️ this === window，不是 btn
  alert('attachEvent 触发');
}

// 注册
if (btn.attachEvent) {
  btn.attachEvent('onclick', handleClick);
}

// 移除
// btn.detachEvent('onclick', handleClick);
```

### 4、经典痛点：this 指向修复

```javascript
btn.attachEvent('onclick', function () {
  // 手动修正 this 指向为元素本身
  handleClick.call(btn);
});
```

### 5、跨浏览器兼容封装（历史方案）

```javascript
function on(element, eventName, handler) {
  if (element.addEventListener) {
    element.addEventListener(eventName, handler);
  } else if (element.attachEvent) {
    // IE8-：修正 this + 事件名加 on
    element.attachEvent('on' + eventName, function () {
      handler.call(element);
    });
  } else {
    // 终极降级：DOM0级
    element['on' + eventName] = handler;
  }
}

function off(element, eventName, handler) {
  if (element.removeEventListener) {
    element.removeEventListener(eventName, handler);
  } else if (element.detachEvent) {
    element.detachEvent('on' + eventName, handler);
  } else {
    element['on' + eventName] = null;
  }
}
```

### 6、淘汰原因总结

1. IE8 市场占比已趋近于零，无维护必要
2. `this` 指向反直觉，极易引发隐蔽 bug
3. 事件执行顺序与标准相反，逻辑难以预测
4. IE11 已彻底移除该 API
5. 现代框架底层均不再兼容此方案

## 五、事件移除

1. **DOM0级绑定的事件**：直接将事件属性设为 `null` 即可移除，如 `btn.onclick = null`。
   
    > 注意：只有赋值函数引用才能移除，匿名函数赋值后无法清除（但设为null即可覆盖）。
2. **DOM2级绑定的事件**：必须使用 `removeEventListener`，且传入的**事件类型、处理函数引用、第三个参数**必须和绑定时完全一致，**匿名函数无法被正确移除**。
```javascript
function handler(e) { console.log(e) }
btn.addEventListener('click', handler, false)
btn.removeEventListener('click', handler, false) // 成功移除
```

3. **`attachEvent` 绑定的事件**：使用 `detachEvent`，传入相同的事件名和处理函数引用，同样无法移除匿名函数。

## 六、事件流的三个阶段

DOM事件流描述的是事件从触发到结束的完整传播路径，共三个阶段：
1. **捕获阶段**：事件从 `window` 对象自上而下向目标元素传播，完整路径为：
   `window → document → html（document.documentElement） → body → ... → 目标元素的父元素`
   
   特点：默认不会触发监听函数，除非 `addEventListener` 第三个参数设为 `true`。
2. **目标阶段**：事件到达触发它的原始目标元素，此时事件在目标元素上执行处理逻辑。
   
   注意：在目标阶段，`event.eventPhase` 为 `2`，`event.target === event.currentTarget`。
3. **冒泡阶段**：事件从目标元素自下而上反向传播回 `window`，是**事件委托机制的核心原理**。
   
   特点：大多数事件都会冒泡，但少数事件不会（如 `focus`、`blur`、`load`、`unload`、`mouseenter`、`mouseleave`）。

说明：

1. **捕获阶段**：通过将 `addEventListener` 的第三个参数设置为 `true`，可以监听捕获阶段的事件。
2. **目标阶段**：目标阶段是事件到达目标元素时触发的阶段。
3. **冒泡阶段**：默认情况下，`addEventListener` 监听的是冒泡阶段的事件。

补充：可通过 `event.eventPhase` 判断当前所处阶段：

- `0`：事件没有发生
- `1`：捕获阶段
- `2`：目标阶段
- `3`：冒泡阶段

## 七、事件对象常用API
事件处理函数接收的 `event` 对象包含事件的全部信息，常用属性和方法：

### 1、核心属性
- `event.target`：**触发事件的原始元素**（事件源，不随冒泡改变）
- `event.currentTarget`：**当前正在处理事件的绑定元素**（等于 `this`，随冒泡改变）
- `event.type`：事件类型，如 `'click'`、`'keydown'`
- `event.timeStamp`：事件触发的时间戳（相对于页面加载）
- `event.clientX / clientY`：鼠标事件时，相对于**浏览器视口**的坐标
- `event.pageX / pageY`：鼠标事件时，相对于**整个文档**的坐标（包含滚动距离）
- `event.key`：键盘事件时，按下的键值（如 `'Enter'`、`'a'`）
- `event.code`：键盘事件时，按下的物理键位（如 `'KeyA'`、`'Enter'`）

### 2、核心方法
- `event.preventDefault()`：阻止浏览器的**默认行为**（如阻止链接跳转、表单自动提交、右键菜单）
  
  > 注意：只对 `cancelable` 为 `true` 的事件有效，且 `passive: true` 时调用会报错。
- `event.stopPropagation()`：阻止事件继续向上冒泡或向下捕获（不影响其他监听器）
- `event.stopImmediatePropagation()`：**立即停止传播**，且阻止当前元素上后续绑定的其他同名事件执行

## 八、事件委托
### 1、原理
利用**事件冒泡机制**，将多个子元素的事件统一绑定到**父元素**上，通过判断 `event.target` 的标签名、类名、属性等来执行对应逻辑。

### 2、优点
1. 无需为动态新增的子元素重复绑定事件，自动生效
2. 减少事件监听器的数量，大幅降低内存占用
3. 简化代码，避免频繁绑定/解绑事件

### 3、缺点/注意点
1. 部分不冒泡的事件无法使用事件委托（如 `focus`、`blur`）
2. 如果层级过深、冒泡路径过长，会有轻微的性能损耗
3. 需要精确判断 `target`，避免误触发（比如子元素内有嵌套标签，需向上查找匹配元素）

### 4、简单示例
```html
<ul id="list">
  <li data-id="1">item1</li>
  <li data-id="2">item2</li>
</ul>
```
```js
document.getElementById('list').addEventListener('click', function(e) {
  // 兼容处理：如果点击的是li内部的span，需向上找到li
  const li = e.target.closest('li')
  if (li && this.contains(li)) {
    console.log('点击了li，id为：', li.dataset.id)
  }
})
```

## 九、补充高频拓展知识点
### 1、阻止默认行为的常见场景
- `<a>` 链接跳转：`e.preventDefault()`
- 表单 `submit` 自动提交：`e.preventDefault()`
- 输入框 `keydown` 禁止输入某些字符：`e.preventDefault()`
- 禁止右键菜单：`contextmenu` 事件调用 `e.preventDefault()`

### 2、事件委托 vs 直接绑定
| 对比项 | 事件委托 | 直接绑定 |
| ---- | ---- | ---- |
| 动态元素 | 支持 | 需重新绑定 |
| 内存占用 | 少（一个父监听器） | 多（每个子元素一个监听器） |
| 事件类型限制 | 仅限冒泡事件 | 所有事件 |
| 事件粒度 | 需手动判断target | 直接绑定到目标 |

### 3、常见易错点
1. `event.target` 和 `event.currentTarget` 的区别：前者是实际触发元素，后者是绑定事件的元素
2. 匿名函数无法用 `removeEventListener` 移除，务必使用命名函数
3. `stopPropagation()` 无法阻止默认行为，需配合 `preventDefault()` 使用
4. 事件委托时，若子元素有嵌套，直接判断 `e.target.tagName` 会失效，需用 `closest()` 向上查找
4. `attachEvent` 的 `this` 指向 `window`、事件名带 `on` 前缀，是IE旧版特有历史问题