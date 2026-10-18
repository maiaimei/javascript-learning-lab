# 鼠标事件

| 事件 | 触发时机 | 是否冒泡 | 备注 |
|------|---------|---------|------|
| `mousedown` | 任意鼠标按键**按下**的瞬间 | ✅ 是 | 左/中/右都触发；可通过 `e.button` 判断键位 |
| `mouseup` | 任意鼠标按键**松开**的瞬间 | ✅ 是 | 若松开时不在原元素上，事件仍冒泡但 `click` 不触发 |
| `click` | `mousedown` + `mouseup` 在同一元素上完成 | ✅ 是 | **仅左键**触发；右键不触发 |
| `dblclick` | 快速连续两次 `click` | ✅ 是 | 实际顺序：`down→up→click→down→up→click→dblclick` |
| `mousemove` | 光标在元素内**移动时持续触发** | ✅ 是 | 高频事件！禁止在里面写重计算/DOM操作 |
| `mouseover` | 光标**进入**元素，或从子元素移入也算 | ✅ 是 | 会反复触发，别拿来做委托 ⚠️ |
| `mouseout` | 光标**离开**元素，移到子元素上也算 | ✅ 是 | 和 `mouseover` 成对，冒泡很吵 |
| `mouseenter` | 光标**首次进入**元素边界 | ❌ 否 | 不冒泡！**不能事件委托** |
| `mouseleave` | 光标**真正离开**元素边界 | ❌ 否 | 不冒泡！穿透子元素不重复触发 |
| `contextmenu` | 右键（或系统菜单键）唤出上下文菜单 | ✅ 是 | 常配合 `e.preventDefault()` 自定义右键菜单 |
| `wheel` | 滚轮滚动时触发 | ✅ 是 | ⚠️ 严格说不算"点击家族"，独立记 |

> 💡 补充：`auxclick` 偶尔会见到（中键/右键点击），现代浏览器新增，日常业务极少用，面试不常考。

---

# 鼠标事件对象

📌 提示： MouseEvent  继承自  UIEvent  →  Event ；移动端触摸请用  TouchEvent ，鼠标事件在手机上只是模拟触发。

## 常用属性
- `event.clientX` / `event.clientY`：鼠标相对于**浏览器视口**的坐标
- `event.pageX` / `event.pageY`：鼠标相对于**整个文档**的坐标（包含滚动距离）
- `event.screenX` / `event.screenY`：鼠标相对于**屏幕**的坐标
- `event.button`：按下的鼠标键（`0`：左键，`1`：中键，`2`：右键）
- `event.buttons`：同时按下的鼠标键（按位标志，`1`：左键，`2`：右键，`4`：中键）
- `event.relatedTarget`：与事件相关的元素（如 `mouseover` 时进入的目标元素）

## 常用方法
- `event.preventDefault()`：阻止默认行为（如右键菜单、链接跳转）
- `event.stopPropagation()`：阻止事件冒泡
- `event.stopImmediatePropagation()`：阻止冒泡并阻止当前元素后续事件处理

> ⚠️ 注意：鼠标事件在移动端通常会被模拟为触摸事件，需使用 `TouchEvent` 处理。