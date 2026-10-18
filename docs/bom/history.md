# BOM `history` 对象学习笔记

> 📌 说明：`window.history` 用来操作浏览器的会话历史记录（当前标签页访问过的页面列表）。**注意：它只能操作同源页面**，且出于安全限制无法读取具体 URL 列表。
> ⚠️ 已不推荐直接操作 `history` 实现复杂路由，现代项目多用 `history` 库 / 框架路由，但底层原理一致。

---

## 1. 基本访问方式
 ```javascript
window.history
// 或简写
history
```

---

## 2. history 的属性

| 属性 | 说明 | 备注 |
|------|------|------|
| `history.length` | 当前会话历史栈中的**记录总数**（包含当前页面） | 只读。新标签打开时初始值为 `1` |
| `history.state` | 当前激活历史条目对应的**状态对象** | 只读。由 `pushState` / `replaceState` 存入 |
| `history.scrollRestoration` | 控制刷新/返回时是否自动恢复滚动位置 | 可选值：`"auto"`（默认） / `"manual"` |

### 示例

```javascript
console.log(history.length);        // 3
console.log(history.state);         // { page: 'home' } 或 null
history.scrollRestoration = 'manual'; // 手动管理滚动位置
```

> 💡 `history.state` 不会持久化到 localStorage，仅存在于内存栈中。

---

## 3. 常用方法

### 3.1 `history.back()`
后退一页，等价于浏览器左上角 ← 按钮。

```javascript
history.back();

// 等价于 history.go(-1)
```

### 3.2 `history.forward()`
前进一页，等价于 → 按钮。

```javascript
history.forward();

// 等价于 history.go(1)
```

### 3.3 `history.go(n)`
跳转到相对当前位置的第 n 条记录。

| 调用 | 效果 |
|------|------|
| `go(-2)` | 后退 2 页 |
| `go(0)` | 刷新当前页 |
| `go(1)` | 前进 1 页 |

> 如果 n 超出范围，什么都不做，也不报错。

### 3.4 `history.pushState(state, title, url)` ⭐重点
向历史栈**新增一条记录**，页面不刷新。

| 参数 | 说明 |
|------|------|
| `state` | 任意可序列化对象，触发 `popstate` 时可读取 |
| `title` | 目前浏览器基本忽略，传 `''` 即可 |
| `url` | 新地址（同源！相对/绝对路径都行），地址栏会变 |

```javascript
history.pushState(
{ userId: 123, from: 'list' },
'',
'/user/123'
);

// 地址栏变成 /user/123，页面不重新请求，history.length +1
```

### 3.5 `history.replaceState(state, title, url)` ⭐重点

**替换当前历史条目**，不新增记录，`length` 不变。

```javascript
// 常用于埋点、修正 URL 但不想让用户能『后退』回来

history.replaceState({ updated: true }, '', '/user/123?ts=1697000000');
```

---

## 4. 关联事件：`popstate`

> ⚠️ 重点坑点：**`pushState` / `replaceState` 不会触发 `popstate`！**
> 只有用户点击前进/后退按钮、或调用 `history.back()/forward()/go()` 才会触发。

```javascript
window.addEventListener('popstate', (event) => {
console.log('当前 state:', event.state);
console.log('history.state:', history.state);

// 这里写路由切换逻辑
});
```

| 场景 | 是否触发 popstate |
|------|------------------|
| 用户点浏览器 ← / → | ✅ 是 |
| `history.back()` / `go(-1)` | ✅ 是 |
| `history.pushState()` | ❌ 否 |
| `history.replaceState()` | ❌ 否 |
| 页面首次加载 | ❌ 否（Chrome 旧版有 bug，别依赖） |

---

## 5. 同源限制 & 安全说明

| 限制点 | 详情 |
|--------|------|
| 不能读历史 URL | `history` 对象拿不到具体访问过哪些网址 |
| 只能操作同源 | `pushState` 的 url 必须和当前域同源，否则抛 `SecurityError` |
| 不能跨标签页 | 每个标签页有独立的历史栈 |

---

## 6. 典型使用场景

1. **SPA 前端路由**（Vue Router / React Router history 模式底层）
2. 列表页筛选条件写入 URL，但不刷新页面
3. 禁止浏览器自动恢复滚动，自己控制 `scrollRestoration = 'manual'`

---

## 7. 速查对照表

| 想做的事 | 用什么 |
|----------|--------|
| 回退一页 | `history.back()` |
| 前进一页 | `history.forward()` |
| 新增路由且不刷新 | `history.pushState()` |
| 改 URL 但不留后退记录 | `history.replaceState()` |
| 监听前进/后退 | `window.onpopstate` |
| 看当前栈长度 | `history.length` |
| 拿当前存的状态 | `history.state` |

---

## 8. 易错小结 📝

1. `pushState` **不会触发** `popstate`，需要自己手动调业务逻辑。
2. `title` 参数现在没用，别花时间处理它。
3. `go(0)` 是刷新，但现代更推荐 `location.reload()`。
4. 刷新页面后 `history.state` 还在（浏览器恢复），但 JS 变量全没了，记得在 `DOMContentLoaded` 里读一次。
5. 不要在 `popstate` 里无脑 `pushState`，容易死循环栈爆炸 💥。

---
> 📖 扩展阅读：`hashchange` 事件（hash 路由用） vs `popstate`（history 路由用）
