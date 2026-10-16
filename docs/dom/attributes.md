# DOM 属性操作笔记（内置 / 自定义 / H5 data-*）

## 一、DOM 属性操作总览

| 操作 | 内置属性 | 自定义属性 | H5 data-* 属性 |
|------|----------|------------|----------------|
| 获取 | `element.属性` | `getAttribute()` | `dataset` |
| 设置 | `element.属性 = 值` | `setAttribute()` | `dataset.xxx` |
| 移除 | `element.属性 = ''` | `removeAttribute()` | `delete dataset.xxx` |
| 是否存在 | `element.属性` | `hasAttribute()` | `'xxx' in dataset` |

---

## 二、内置属性（标准 HTML 属性）

> 如：`id`、`class`、`src`、`href`、`value`、`checked` 等

### 1. 获取

```
element.id
element.className
element.src
element.value
```

### 2. 设置

```
element.id = 'box';
element.className = 'active';
element.value = 'hello';
```

### 3. 移除

```
element.id = '';
element.className = '';
```

> ⚠️ 不会真正删除属性，只是清空值

### 4. 是否存在

```
if (element.id) {
console.log('存在')
}
```

---

## 三、自定义属性（非 H5）

> 如：`<div index="1"></div>`

### 1. 获取

```
element.getAttribute('index')
```

### 2. 设置

```
element.setAttribute('index', '2')
```

### 3. 移除

```
element.removeAttribute('index')
```

### 4. 是否存在

```
element.hasAttribute('index')
```

---

## 四、H5 data-* 属性（推荐）

> 如：`<div data-id="1" data-user-name="Tom"></div>`

### 1. 获取

```
element.dataset.id        // "1"
element.dataset.userName  // "Tom"（驼峰命名）
```

### 2. 设置

```
element.dataset.id = '2';
element.dataset.userName = 'Jack';
```

### 3. 移除

```
delete element.dataset.id
```

### 4. 是否存在

```
'id' in element.dataset
```

---

## 五、三种方式对比总结

| 对比项 | 内置属性 | 自定义属性 | H5 data-* |
|--------|----------|------------|-----------|
| 操作方式 | 点语法 | get/set/removeAttribute | dataset |
| 是否推荐 | ✅ | ❌ | ✅✅ |
| 是否标准 | ✅ | ❌ | ✅ |
| 是否自动同步 HTML | ✅ | ✅ | ✅ |

---

## 六、常见易错点 ⚠️

1. `className` ≠ `class`
2. `element.style` 只能获取行内样式
3. `dataset` 获取的值都是 **字符串**
4. 自定义属性不要用点语法（不推荐）

---

## 七、速记口诀 🧠

> **内置用点，自定义用 get/set，H5 用 dataset**
