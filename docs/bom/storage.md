# BOM 本地存储学习笔记

## 1. 概述
Web 存储 API 属于 **BOM（Browser Object Model）** 的一部分，提供了在浏览器端保存键值对数据的能力。
主要包含两种对象：
| 对象 | 说明 |
| --- | --- |
| `localStorage` | 持久化本地存储 |
| `sessionStorage` | 会话级本地存储 |

> 存储的值**只能是字符串**，对象和数组需要 `JSON.stringify()` / `JSON.parse()` 处理。

---

## 2. 它们分别是什么

### 2.1 localStorage
- 数据**永久保存在浏览器中**，除非手动删除（代码/浏览器清除缓存）
- 同源（协议+域名+端口）下的所有标签页、窗口**共享同一份数据**
- 容量一般为 **5MB**（不同浏览器略有差异）

### 2.2 sessionStorage
- 数据仅在**当前浏览器标签页的会话期间有效**
- 关闭标签页/窗口，数据立刻清空
- **不同标签页即使同源也不共享**（复制链接新开标签页也算新的）
- 容量同样约 **5MB**

---

## 3. 常用 API 方法（两者完全一样）

```javascript
// 1. 存储数据
localStorage.setItem('token', 'abc123');
sessionStorage.setItem('tempForm', JSON.stringify({name: 'Tom'}));

// 2. 读取数据
const token = localStorage.getItem('token');
const form = JSON.parse(sessionStorage.getItem('tempForm') || '{}');

// 3. 删除某一条
localStorage.removeItem('token');
sessionStorage.removeItem('tempFrom');

// 4. 清空全部
localStorage.clear();
sessionStorage.clear();

// 5. 获取 key 名（索引方式）
localStorage.key(0); // 返回第0个key的名称

// 6. 获取长度
console.log(localStorage.length);
```

### 💡 存储对象的完整写法

```javascript
const user = { id: 1, role: 'admin' };

localStorage.setItem('user', JSON.stringify(user));

// 读取时记得兜底
const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
```

---

## 4. localStorage vs sessionStorage 对比表

| 对比维度 | localStorage | sessionStorage |
| --- | --- | --- |
| 生命周期 | 永久，需手动清除 | 标签页关闭即销毁 |
| 跨标签页共享 | ✅ 同源共享 | ❌ 不共享 |
| 刷新页面 | 数据保留 | 数据保留 |
| 关闭再重开 | 数据还在 | 数据没了 |
| 作用域 | 同源 | 同源 + 同标签页 |
| 典型用途 | 登录态、主题配置、购物车 | 表单草稿、单页步骤数据 |

---

## 5. 使用场景

### ✅ 适合用 localStorage
1. 用户登录 Token（配合过期时间逻辑）
2. 网站深色/浅色主题偏好
3. 长期购物车数据（未登录状态）
4. 不敏感的系统配置项

### ✅ 适合用 sessionStorage
1. 多步骤表单，防止刷新丢数据，关掉就不留痕
2. 页面间的临时跳转参数（单页应用）
3. 敏感一次性数据（如短信验证码倒计时状态）
4. 不想污染其他标签页的临时状态

### ❌ 都不适合存什么
- 密码、身份证号等敏感信息（XSS 可直接读取）
- 大量结构化数据（超过几 MB 考虑 IndexedDB）
- 需要和服务端实时同步的状态

---

## 6. 监听存储变化（补充考点）

> 只有 **localStorage** 跨标签页修改会触发，`sessionStorage` 不会触发

```javascript
window.addEventListener('storage', (e) => {
console.log('key变了:', e.key);
console.log('旧值:', e.oldValue);
console.log('新值:', e.newValue);
console.log('来源页面:', e.url);
});
```

> ⚠️ 注意：触发事件的页面**自己不会收到**，是其他同源标签页收到。

---

## 7. 常见坑点小结

| 坑点 | 说明 |
| --- | --- |
| 只存字符串 | 存对象不序列化会变成 `[object Object]` |
| 隐身模式 | Safari 隐身模式下 `setItem` 可能抛异常，建议 try...catch |
| 同源策略 | 不同端口也算不同源，互相读不到 |
| 容量上限 | 超出 5MB 会抛 `QuotaExceededError` |
| XSS 风险 | JS 可读 = 有 XSS 就能偷，别存 token 明文（HttpOnly Cookie 更安全） |