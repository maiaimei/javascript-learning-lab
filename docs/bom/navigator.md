# BOM `navigator` 对象学习笔记

> **说明**：`window.navigator` 用于获取浏览器及运行环境信息，属于 BOM 核心对象。
> 运行环境：浏览器端（Node.js 中不存在）；部分属性在隐私模式/无痕模式下会被脱敏。

---

## 一、基本概念

| 项目 | 说明 |
|------|------|
| 访问方式 | `window.navigator` 或简写 `navigator` |
| 作用 | 识别用户代理（UA）、网络状态、语言、硬件信息、权限等 |
| 注意 | 很多属性可被伪造，**不可用于强安全校验** |

---

## 二、常用只读属性

### 1. 浏览器 & 系统标识

| 属性 | 说明 | 示例 |
|------|------|------|
| `navigator.userAgent` | 完整 UA 字符串（逐步废弃中） | `"Mozilla/5.0 (Macintosh; ... Chrome/118.0..."` |
| `navigator.appName` | 历史遗留，基本都是 `Netscape` | 不推荐用 |
| `navigator.appVersion` | 旧版版本信息 | 不推荐用 |
| `navigator.platform` | 操作系统平台 | `"MacIntel"`, `"Win32"`, `"Linux x86_64"` |
| `navigator.vendor` | 浏览器厂商 | `"Google Inc."` |

> ⚠️ 现代推荐：用 `navigator.userAgentData`（[User-Agent Client Hints](https://developer.mozilla.org/zh-CN/docs/Web/API/NavigatorUAData)）替代 UA 解析

### 2. 语言相关

| 属性 | 说明 |
|------|------|
| `navigator.language` | 首选语言，如 `"zh-CN"` |
| `navigator.languages` | 语言偏好数组，如 `["zh-CN", "zh", "en-US"]` |

### 3. 设备 & 硬件能力

| 属性 | 说明 |
|------|------|
| `navigator.hardwareConcurrency` | CPU 逻辑核心数 |
| `navigator.deviceMemory` | 设备内存（GB，取整），隐私模式返回 `undefined` |
| `navigator.maxTouchPoints` | 最大触控点数（0 表示非触屏） |

### 4. 网络 & 在线状态

| 属性 | 说明 |
|------|------|
| `navigator.onLine` | `true/false`，是否联网（仅反映本地连接，不保证能访问外网） |
| `navigator.connection` | 返回 `NetworkInformation` 对象（见下方） |

```javascript
// 网络信息示例
const conn = navigator.connection;
console.log(conn.effectiveType); // '4g' | '3g' | '2g' | 'slow-2g'
console.log(conn.downlink);      // 下行带宽(Mbps)
console.log(conn.rtt);           // 往返时间(ms)
```

### 5. 媒体 & 权限 & 特性检测

| 属性 | 说明 |
|------|------|
| `navigator.cookieEnabled` | 是否启用 Cookie |
| `navigator.javaEnabled()` | 是否启用 Java（基本已废弃） |
| `navigator.mediaDevices` | 音视频设备 API 入口 |
| `navigator.permissions` | 权限查询 API |
| `navigator.clipboard` | 剪贴板 API |
| `navigator.geolocation` | 地理位置 API |
| `navigator.serviceWorker` | Service Worker 控制器 |

---

## 三、常用方法

| 方法 | 说明 | 示例 |
|------|------|------|
| `navigator.sendBeacon(url, data)` | 页面卸载时可靠发数据（埋点神器） | 见代码块👇 |
| `navigator.registerProtocolHandler(scheme, url, title)` | 注册自定义协议处理 | 较少用 |
| `navigator.vibrate(pattern)` | 触发设备震动（仅安卓/移动端） | `navigator.vibrate([200,100,200])` |
| `navigator.share(data)` | 调起系统分享面板（HTTPS 环境） | 见代码块👇 |
| `navigator.permissions.query({name})` | 查询权限状态 | 见代码块👇 |
| `navigator.getBattery()` | 获取电池状态（已逐步废弃） | Promise |

### 代码示例合集

```javascript
// 1. 页面离开埋点（推荐 sendBeacon）
window.addEventListener('unload', () => {
navigator.sendBeacon('/api/log', JSON.stringify({ page: 'home' }));
});

// 2. 查询通知权限
navigator.permissions.query({ name: 'notifications' }).then(res => {
console.log(res.state); // 'granted' | 'denied' | 'prompt'
});

// 3. 调起系统分享
if (navigator.share) {
navigator.share({
title: '学习笔记',
text: 'Navigator 笔记',
url: location.href
}).catch(console.error);
}

// 4. 检测是否触屏设备
const isTouchDevice = navigator.maxTouchPoints > 0;
// 5. 监听在线状态变化
window.addEventListener('online', () => console.log('已联网'));
window.addEventListener('offline', () => console.log('断网了'));
```

---

## 四、现代 API：`userAgentData`（重点记）

> 替代 `userAgent` 字符串解析的新标准

```javascript
if (navigator.userAgentData) {
console.log(navigator.userAgentData.brands);
// [{brand:'Chromium', version:'118'}, {brand:'Google Chrome',...}]
console.log(navigator.userAgentData.mobile); // true/false
console.log(navigator.userAgentData.platform); // 'macOS'

// 高级提示（需异步）
navigator.userAgentData.getHighEntropyValues(['architecture','model','uaFullVersion'])
.then(info => console.log(info));
}
```

---

## 五、常见踩坑点 ⚠️

1. **拼写坑**：是 `navigator`，不是 `navigatior` / `navagator`
2. **隐私模式**：`deviceMemory`、`userAgent` 可能被限制
3. **UA 不可信**：爬虫/浏览器插件都能改，别拿来做权限判断
4. **`onLine` 不靠谱**：连了路由器但没外网也会返回 `true`
5. **`sendBeacon` 只能用 POST**，且数据大小建议 < 64KB
6. **`navigator.share` / `clipboard` 必须在用户手势后调用 + HTTPS**

---

## 六、速查思维导图（文字版）

```
navigator
├── 身份: userAgent / userAgentData / platform / vendor
├── 语言: language / languages
├── 硬件: hardwareConcurrency / deviceMemory / maxTouchPoints
├── 网络: onLine / connection
├── 能力: cookieEnabled / geolocation / mediaDevices / clipboard
├── 方法: sendBeacon / share / vibrate / permissions.query
└── 监听: window online/offline 事件
```

---

## 七、面试一句话总结

> *"`navigator` 是 BOM 里描述浏览器环境的对象，以前靠 `userAgent` 嗅探，现在推荐 `userAgentData` + 特性检测；实际项目里最常用的是 `sendBeacon` 做埋点、`onLine` 判网络、`permissions` 查权限。"*