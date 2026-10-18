# 键盘事件

| 事件         | 触发时机                     | 是否冒泡 | 备注                                                                 |
|--------------|------------------------------|---------|----------------------------------------------------------------------|
| `keydown`    | 按下任意键时触发             | ✅ 是    | 持续按住键时会重复触发，需配合 `event.repeat` 判断是否为重复触发     |
| `keypress`   | 按下**字符键**时触发         | ✅ 是    | 已废弃，现代浏览器不推荐使用，建议用 `keydown` 替代                  |
| `keyup`      | 松开任意键时触发             | ✅ 是    | 不会重复触发，适合监听键盘输入完成的操作                             |

---

# 键盘事件对象

📌 提示：`KeyboardEvent` 继承自 `UIEvent` → `Event`，常用属性和方法如下：

## 常用属性

- `event.key`：返回按下的键值（如 `'Enter'`、`'a'`、`'ArrowUp'`）。
- `event.code`：返回物理键位的代码（如 `'KeyA'`、`'Enter'`），与键盘布局无关。
- `event.repeat`：布尔值，表示当前事件是否为按住键不放导致的重复触发。
- `event.ctrlKey` / `event.shiftKey` / `event.altKey` / `event.metaKey`：布尔值，表示是否按下了对应的修饰键（Ctrl、Shift、Alt、Meta）。
- `event.location`：表示按键的位置（如左侧或右侧 Shift 键），常见值：
  - `0`：标准键盘位置
  - `1`：左侧键盘位置
  - `2`：右侧键盘位置
  - `3`：数字小键盘位置

## 常用方法

- `event.preventDefault()`：阻止默认行为（如阻止浏览器快捷键）。
- `event.stopPropagation()`：阻止事件冒泡。

---

# 示例代码

## 监听键盘事件

```javascript
document.addEventListener('keydown', function (event) {
  console.log('按下的键值:', event.key);
  console.log('物理键位代码:', event.code);
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault(); // 阻止默认保存行为
    console.log('触发自定义保存逻辑');
  }
});
```

## 判断修饰键

```javascript
document.addEventListener('keyup', function (event) {
  if (event.shiftKey) {
    console.log('Shift 键被按下');
  }
});
```

## 判断重复触发

```javascript
document.addEventListener('keydown', function (event) {
  if (event.repeat) {
    console.log('按键重复触发:', event.key);
  }
});
```

⚠️ 注意：keypress 事件已废弃，建议使用 keydown 和 keyup 代替。