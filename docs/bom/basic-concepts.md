# 前端 BOM（Browser Object Model）详解

**BOM（Browser Object Model，浏览器对象模型）**，是前端里用来和**浏览器本身**打交道的一套 API，跟页面内容无关，管的是“浏览器窗口、地址栏、历史记录、屏幕信息”这些。

> 💡 核心结论：**BOM 在 HTML5 之前没有正式标准，但 `window` 就是它的顶层对象。** 所有 BOM 相关的东西都挂在 `window` 上。

---

## 1. BOM 与 DOM 的区别（常考）

| | 操作对象 | 谁提供的 |
|---|---|---|
| **DOM** | 页面里的 HTML 元素（`document`） | W3C 标准 |
| **BOM** | 浏览器窗口、标签页、地址栏等 | 浏览器实现（HTML5 后逐步规范） |

> 关系：`window > document > 页面DOM树`。`document` 其实是 BOM 里 `window` 的一个属性 😄

---

## 2. BOM 的核心组成

| 对象 | 干啥用的 | 常见例子 |
|---|---|---|
| **`window`** | 全局顶层，代表浏览器窗口 | `window.innerWidth`、`window.alert()` |
| **`location`** | 控制当前 URL | `location.href`、`location.reload()` |
| **`history`** | 操作浏览历史 | `history.back()`、`history.pushState()` |
| **`navigator`** | 浏览器/系统信息 | `navigator.userAgent` |
| **`screen`** | 用户屏幕信息 | `screen.width`、`screen.height` |
| **`document`** | （严格说算 DOM，但挂在 window 下） | — |

> 📌 补充：定时器 `setTimeout`、`setInterval` 也是 `window` 的方法，属于 BOM 范畴。

---

## 3. BOM 的常用事件

#### load 事件

load  是 window 对象（BOM 层面） 上的事件，表示：整个页面及所有依赖资源都已经下载并完成解析渲染了。

依赖资源包括：HTML、CSS、JS、图片、iframe、字体文件。

```javascript
window.addEventListener('load', () => {
  console.log('页面和所有资源都加载完毕啦');
});
```

| 事件 | 触发时机 |
| --- | --- |
| DOMContentLoaded | HTML 解析完，DOM 树建好（不管 CSS/图片） |
| load | DOM + 所有资源（图/CSS/JS/iframe）全加载完 |

下载HTML → 解析DOM → DOMContentLoaded → 继续加载图片/CSS → load

📌 所以 "load" 永远比 "DOMContentLoaded" 晚，有时候晚很多（尤其图片多的时候）。

```javascript
// 1. BOM load（推荐，不覆盖）
window.addEventListener('load', fn);

// 2. 老写法（只能写一个，会覆盖）
window.onload = fn;

// 3. jQuery 的 $(document).ready()  ❗等价于 DOMContentLoaded，不是 load！
$(function(){});
```

### resize 事件

"resize" 是 BOM（Browser Object Model） 中挂在 "window" 对象上的事件，当浏览器窗口（视口）的尺寸发生变化时触发。

注意：它属于 BOM 而非 DOM，因为它监听的是「浏览器窗口」本身，不是某个具体的 HTML 元素。

```javascript
window.addEventListener('resize', () => {
  console.log('当前视口宽高：', window.innerWidth, window.innerHeight);
});
```

如果只是响应尺寸变化做样式/逻辑，可以用 "ResizeObserver"（监听元素，不监听 window），比 "resize" 更精准：

```javascript
const ro = new ResizeObserver(entries => {
  // 元素尺寸真变了才执行
});
ro.observe(document.querySelector('#chart'));
```

区别小结："window.resize" 只管窗口；"ResizeObserver" 管任意元素。

"window.resize" 是视口尺寸变化的信号弹，高频、全局、只管窗口。实际用的时候记得防抖 + 解绑，能交给 CSS 的就别用 JS。

---

### 定时器

#### 定时器之setTimeout/clearTimeout

- **`setTimeout`**：用于延迟执行某段代码，仅执行一次。
  - 语法：`const timeoutID = setTimeout(callback, delay, ...args);`
    - `callback`：延迟后执行的函数。
    - `delay`：延迟时间（毫秒）。
    - `...args`：传递给 `callback` 的参数。
  - 返回值：`timeoutID`，可用于清除定时器。
  - 示例：
    ```javascript
    const timeoutID = setTimeout(() => {
      console.log('延迟 1 秒后执行');
    }, 1000);
    ```

- **`clearTimeout`**：用于取消由 `setTimeout` 设置的定时器。
  - 语法：`clearTimeout(timeoutID);`
  - 示例：
    ```javascript
    const timeoutID = setTimeout(() => {
      console.log('这段代码不会执行');
    }, 1000);
    clearTimeout(timeoutID);
    ```

---

#### 定时器之setInterval/clearInterval

- **`setInterval`**：用于以固定时间间隔重复执行某段代码。
  - 语法：`const intervalID = setInterval(callback, delay, ...args);`
    - `callback`：每隔 `delay` 毫秒执行的函数。
    - `delay`：时间间隔（毫秒）。
    - `...args`：传递给 `callback` 的参数。
  - 返回值：`intervalID`，可用于清除定时器。
  - 示例：
    ```javascript
    const intervalID = setInterval(() => {
      console.log('每隔 1 秒执行一次');
    }, 1000);
    ```

- **`clearInterval`**：用于取消由 `setInterval` 设置的定时器。
  - 语法：`clearInterval(intervalID);`
  - 示例：
    ```javascript
    const intervalID = setInterval(() => {
      console.log('这段代码不会重复执行');
    }, 1000);
    clearInterval(intervalID);
    ```

---

#### 注意事项
1. **`setTimeout` 和 `setInterval` 的最小延迟**：
   - HTML 标准规定，最小延迟时间为 4 毫秒，但在某些浏览器中可能会更高。
2. **避免内存泄漏**：
   - 在组件销毁或页面卸载时，及时清除定时器。
   - 示例：
     ```javascript
     const timeoutID = setTimeout(() => {
       console.log('清理前的定时器');
     }, 1000);

     window.addEventListener('beforeunload', () => {
       clearTimeout(timeoutID);
     });
     ```
3. **嵌套 `setTimeout` 替代 `setInterval`**：
   - 使用嵌套 `setTimeout` 可以避免 `setInterval` 的时间偏差问题。
   - 示例：
     ```javascript
     function repeat() {
       console.log('每隔 1 秒执行一次');
       setTimeout(repeat, 1000);
     }
     repeat();
     ```

## 4. 高频使用场景示例

```javascript
// 1. 跳转页面（最常用）
location.href = 'https://example.com';

// 或者只改路径
location.pathname = '/login';

// 2. 刷新
location.reload();

// 3. 回退一页
history.back();

// 4. 判断是不是手机端
const isMobile = /Android|iPhone/i.test(navigator.userAgent);

// 5. 获取视口大小
console.log(window.innerWidth, window.innerHeight);

// 6. 新开窗口（现在常被浏览器拦截）
window.open('https://example.com');
```

---

## 5. 容易踩的坑 ⚠️

| 坑点 | 说明 |
|---|---|
| `window.open` 经常被拦截 | 必须**用户手势触发**（click 里调才行），否则弹窗拦截 |
| `navigator.userAgent` 不可全信 | 现代浏览器都能伪造，别拿它做强判断 |
| `history.pushState` 不刷新页面 | SPA 路由原理，但不会触发 `popstate` 以外的事件 |
| 移动端 `innerWidth` vs `screen.width` | 前者是**视口**，后者是**物理屏幕**，别搞混 |

---

## 6. 现在还要深学 BOM 吗？

现代开发现状：
- 路由交给 **Vue Router / React Router**（底层还是 `history` API）
- UA 判断交给库或者服务端
- 弹窗基本不用 `alert/confirm`（体验差）
