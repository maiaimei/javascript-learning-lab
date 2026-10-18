# BOM `location` 对象学习笔记

## 1. 整体结构一览

假设当前页面 URL 为：

https://www.example.com:8080/path/page.html?id=123&type=home#section2


| 属性 | 值 | 说明 |
|------|-----|------|
| `location.href` | `https://www.example.com:8080/path/page.html?id=123&type=home#section2` | **完整 URL** |
| `location.protocol` | `https:` | 协议（带冒号） |
| `location.host` | `www.example.com:8080` | 主机名 + 端口 |
| `location.hostname` | `www.example.com` | 纯主机名 |
| `location.port` | `8080` | 端口号（默认80/443为空串） |
| `location.pathname` | `/path/page.html` | 路径（以 `/` 开头） |
| `location.search` | `?id=123&type=home` | 查询字符串（含 `?`） |
| `location.hash` | `#section2` | 片段标识符（含 `#`） |
| `location.origin` | `https://www.example.com:8080` | 源（协议+主机+端口，只读） |

> ⚠️ 注意：`origin` 是**只读**的，其他大部分属性可读写。

---

## 2. 属性细节 & 易踩坑点

### 2.1 `search` 不是对象
`search` 只是字符串，**不会自动解析成键值对**，需要手动处理：

```javascript
// 老办法

const params = new URLSearchParams(location.search);

console.log(params.get('id')); // '123'
```

### 2.2 `hash` 的变化不会刷新页面
修改 `#xxx` 只会改动历史记录，**不触发服务端请求**，常用于 SPA 路由。

### 2.3 修改属性的副作用
| 操作 | 是否跳转页面 |
|------|-------------|
| 改 `href` | ✅ 是 |
| 改 `pathname` | ✅ 是 |
| 改 `search` | ✅ 是 |
| 改 `hash` | ❌ 否（仅滚动/改历史） |
| 改 `protocol`/`host` | ✅ 是 |

```javascript
location.hash = 'top';        // 不刷新，URL变了

location.search = '?a=1';     // 刷新并跳转
```

---

## 3. 常用方法

| 方法 | 作用 | 是否加入历史记录 |
|------|------|------------------|
| `location.assign(url)` | 跳转到新 URL | ✅ 是 |
| `location.replace(url)` | 跳转并**替换当前历史记录**（不能后退） | ❌ 否 |
| `location.reload([force])` | 刷新页面。`true`=强制从服务器，`false`/不传=可能读缓存 | - |
| `location.toString()` | 返回 `href` 字符串（隐式调用） | - |

### 代码示例

```javascript
// 1. 普通跳转（可回退）
location.assign('/login');

// 2. 登录后跳转，不希望用户点返回再回来
location.replace('/dashboard');

// 3. 强制刷新（绕过缓存）
location.reload(true);

// 4. 等价写法
window.location = 'https://xxx.com';
location.href = 'https://xxx.com';
// 上面两种本质一样，都触发 assign 行为
```

> 💡 `location = url` / `href = url` 底层最终调用的就是 `assign`

---

## 4. 和 `URL` 对象的配合使用（推荐！）

直接用 `location` 解析参数比较痛苦，现代写法：

```javascript
const url = new URL(location.href);

console.log(url.searchParams.get('id'));

url.searchParams.set('lang', 'zh-CN');

location.assign(url.toString());
```

---

## 5. 安全 & 历史记录注意点

1. **跨域限制**：可以读 `href`，但不能通过 `location` 操作别的窗口的 URL（除非同源）。
2. **XSS 风险**：`location.href = userInput` 要小心 `javascript:` 协议注入。

```javascript
// 危险 ❌

location.href = decodeURIComponent(getQuery('redirect'));

// 安全 ✅ 白名单校验
```

3. `replace` 常用于**敏感页退出后**，防止通过「后退」看到旧页面。

---

## 6. 速查脑图（文字版）

```
window.location
├── 属性
│   ├── href (r/w)
│   ├── origin (只读)
│   ├── protocol / host / hostname / port
│   ├── pathname / search / hash
├── 方法
│   ├── assign()   → 跳转+留历史
│   ├── replace()  → 跳转+覆盖历史
│   ├── reload()   → 刷新
│   └── toString() → 同 href
└── 实战搭档：new URL() + URLSearchParams
```

---

## 7. 面试高频 Q&A

| 问题 | 简答 |
|------|------|
| `assign` 和 `replace` 区别？ | `replace` 不保留当前页历史，无法「后退」 |
| 改 `hash` 会发请求吗？ | 不会，仅客户端行为 |
| `location.origin` 兼容？ | IE11 不支持，需 polyfill 或用 `protocol+//+host` |
| `document.location` vs `window.location`？ | 现代浏览器里是同一个对象引用 |