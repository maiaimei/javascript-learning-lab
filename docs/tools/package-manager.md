# 一、什么是包管理工具？

**包管理工具（Package Manager）** 用于管理 JavaScript/Node.js 生态中的第三方依赖（库、框架、工具）。它们负责：

- 从 **npm registry**（官方仓库）下载依赖
- 管理依赖版本与依赖关系
- 安装、更新、卸载依赖
- 执行项目脚本（如 `dev`、`build`）

主流工具包括：**npm、Yarn、pnpm、Bun**。

---

# 二、npm registry 官方仓库

**npm registry（注册表/仓库）** 是 npm 生态的**核心后端服务**，本质上是一个**巨大的、中心化的 JavaScript 包元数据数据库 + 文件存储服务**。可以把它理解为 **“前端界的 App Store 后台”** 或 **“JavaScript 的 Maven Central”**。

`npm registry` 是 JavaScript 世界的“中央仓库”，`npm`/`pnpm` 是去仓库提货的“物流工具”。

**npm 官方 registry（默认）**：https://registry.npmjs.org/

- 对应网站：https://www.npmjs.com/
- 由 npm, Inc.（现属 GitHub / Microsoft）运营
- 全球 CDN 加速，但国内访问有时较慢

**国内镜像（加速）**：

| **镜像源**              | **地址**                                     |
| :---------------------- | :------------------------------------------- |
| **npmmirror（原淘宝）** | https://registry.npmmirror.com               |
| 腾讯云                  | https://mirrors.cloud.tencent.com/npm/       |
| 华为云                  | https://repo.huaweicloud.com/repository/npm/ |

**Registry 的工作流程（简化版）**：

```
开发者
  │
  ├─ npm publish ──→ npm registry（存储包）
  │
用户
  ├─ npm install ──→ npm registry ──→ 下载依赖
```

------

# 三、.npmrc 配置文件

`.npmrc` 是 `npm`（以及 `pnpm`、`Yarn`）的配置文件，全称 `npm running configuration`。

它用来控制包管理工具的行为，比如：

- 使用哪个 registry（镜像源）

- 如何保存依赖

- 认证信息（登录 token）

- 安装时的各种策略


可以理解为：npm / pnpm 的“设置面板”，以文本文件形式存在。

`.npmrc` 文件格式：**INI 风格键值对**。

`.npmrc` 常见配置项：

```
# 指定下载依赖的仓库地址
registry=https://registry.npmmirror.com

# 作用域包（私有源）。指定 某个组织/作用域 使用私有 registry；公包仍走官方 registry
@mycompany:registry=https://npm.mycompany.com/

# 认证信息（自动生成）。执行 npm login 后自动写入；不要手动改，不要提交到 Git
//registry.npmjs.org/:_authToken=xxxxxxxx

# 依赖保存行为。安装依赖时锁定精确版本（无 ^ 或 ~）
save-exact=true

# 引擎严格模式。如果 package.json 中 engines 声明了 node/npm 版本，不符合就报错
engine-strict=true

# 禁止自动更新。关闭 npm 的“有新版本”提示
update-notifier=false
```

pnpm **完全兼容 npm 的 `.npmrc`**，但还有自己的扩展配置：

```
# 依赖提升策略（解决幽灵依赖兼容问题）
shamefully-hoist=true

# 依赖链接方式（pnpm 9+ 默认）
node-linker=isolated

# 并行安装数
network-concurrency=16

# 严格校验包完整性
verify-store-integrity=true
```

`.npmrc` 可以出现在 4 个层级，优先级从高到低：

| **层级**             | **位置**                                                    | **作用**                         |
| :------------------- | :---------------------------------------------------------- | :------------------------------- |
| **项目级（最优先）** | 项目根目录 `/path/to/project/.npmrc`                        | 当前项目专用配置（**强烈推荐**） |
| **用户级**           | `~/.npmrc`（Mac/Linux） `C:\Users\用户名\.npmrc`（Windows） | 当前用户所有项目                 |
| **全局级**           | `$PREFIX/etc/npmrc`                                         | 本机所有用户                     |
| **内置级**           | npm 安装目录 `/path/to/npm/npmrc`                           | npm 自带默认配置（**不要改**）   |

✅ **最佳实践**：

> **项目级 `.npmrc` 提交到 Git**，保证团队、CI、生产环境行为一致。

**.npmrc vs package.json 的区别**

| **对比项**   | **.npmrc**         | **package.json**          |
| :----------- | :----------------- | :------------------------ |
| 作用         | **工具行为配置**   | **项目元信息 + 依赖声明** |
| 是否提交 Git | ✅ 项目级建议提交   | ✅ 必须提交                |
| 是否影响安装 | ✅ 直接影响         | ✅ 间接影响                |
| 示例         | registry、缓存路径 | dependencies、scripts     |

---

# 四、npm（Node Package Manager）

## 1. 是什么？

- **npm** 是 Node.js 官方内置的包管理工具
- 随 Node.js 一起安装，无需额外配置
- 生态最成熟、兼容性最好
- 使用 `package.json` 描述项目依赖

## 2. 核心文件

| 文件                | 作用                         |
| ------------------- | ---------------------------- |
| `package.json`      | 项目元信息 + 依赖声明        |
| `package-lock.json` | 锁定依赖版本，保证安装一致性 |
| `node_modules/`     | 存放已安装的依赖             |

## 3. 常用命令

```
# 初始化项目
npm init -y

# 写入用户级 .npmrc，切换镜像
npm config set registry https://registry.npmmirror.com

# 查看当前配置
npm config list
npm config get registry

# 删除配置
npm config delete registry

# 临时使用
npm install --registry https://registry.npmmirror.com

# 安装所有依赖
npm install

# 安装生产依赖
npm install lodash

# 安装开发依赖
npm install -D vite typescript

# 全局安装
npm install -g pnpm

# 卸载依赖
npm uninstall lodash

# 运行脚本
npm run dev
npm run build

# 查看过时依赖
npm outdated

# 更新依赖
npm update
```

## 4. 版本符号说明

```
{
  "dependencies": {
    "lodash": "^4.17.0",  // 允许次版本和补丁更新
    "vue": "~3.4.0",      // 只允许补丁更新
    "react": "18.2.0"     // 精确版本
  }
}
```

## 5. 优缺点

**✅ 优点**

- Node.js 自带，零配置
- 生态最完善，几乎所有工具都兼容
- 学习成本低

**❌ 缺点**

- `node_modules` 体积大、重复多
- 安装速度相对较慢
- **幽灵依赖**（Phantom Dependencies）：可以访问未在 `package.json` 中声明的依赖
- 扁平化结构可能导致依赖冲突

------

# 五、pnpm（Performant npm）

## 1. 是什么？

- **pnpm = Performant npm（高性能 npm）**
- 由 Zoltan Kochan 开发，旨在解决 npm 和 Yarn 的缺陷
- 核心思想：**内容寻址存储 + 硬链接 + 符号链接**

> 💡 一句话总结：pnpm 是 npm 的“高性能 + 严格模式”替代方案。

## 2. 核心原理（重点）

pnpm 不使用扁平的 `node_modules`，而是：

1. 全局存储（Global Store）
   - 所有依赖只下载一次，存储在全局目录
   - 不同项目共享同一份依赖
2. 硬链接（Hard Link）
   - 项目中的依赖文件是全局存储的硬链接
   - 不占用额外磁盘空间
3. 符号链接（Symlink）
   - `node_modules` 中通过符号链接指向全局存储
   - 严格遵循依赖声明，杜绝幽灵依赖

```
项目A/node_modules/.pnpm/lodash@4.17.21
        ↓（硬链接）
~/.pnpm-store/v3/files/xx/xxxx
```

## 3. 核心文件

| 文件             | 作用                           |
| ---------------- | ------------------------------ |
| `package.json`   | 项目配置                       |
| `pnpm-lock.yaml` | 锁定依赖（比 npm 更严格）      |
| `node_modules/`  | 严格隔离的依赖结构             |
| `.pnpm-store/`   | 全局依赖存储（通常在用户目录） |

## 4. 常用命令（与 npm 高度一致）

```
# 初始化（通常直接用 npm init）
pnpm init

# 切换镜像
pnpm config set registry https://registry.npmmirror.com

# 查看当前 registry
pnpm config get registry

# 安装所有依赖
pnpm install

# 安装依赖
pnpm add lodash
pnpm add -D vite

# 全局安装
pnpm add -g pnpm

# 卸载
pnpm remove lodash

# 运行脚本
pnpm dev
pnpm build

# 过滤 monorepo 子包
pnpm --filter web dev

# 查看依赖树
pnpm list
```

## 5. 优缺点

**✅ 优点**

- **安装速度极快**（比 npm 快 2-3 倍）
- **磁盘占用极低**（全局共享）
- **严格依赖隔离**，杜绝幽灵依赖
- **天然支持 Monorepo**（Vite、Vue、Astro 官方推荐）
- 兼容 npm 生态

**❌ 缺点**

- 部分老旧工具链可能不兼容（需配置）
- 依赖结构与传统不同，调试 `node_modules` 需要适应
- Windows 下符号链接偶尔有权限问题

------

# 六、npm vs pnpm 核心对比

| 维度     | npm                 | pnpm              |
| -------- | ------------------- | ----------------- |
| 依赖结构 | 扁平化              | 硬链接 + 符号链接 |
| 幽灵依赖 | ❌ 存在              | ✅ 杜绝            |
| 磁盘占用 | 高                  | **极低**          |
| 安装速度 | 中                  | **快**            |
| Monorepo | 基础                | **原生强支持**    |
| 学习成本 | 低                  | 低                |
| 兼容性   | 100%                | 99%+              |
| 锁文件   | `package-lock.json` | `pnpm-lock.yaml`  |

------

# 七、从 npm 迁移到 pnpm（实操）

## 1. 安装 pnpm

```
npm install -g pnpm
# 或
corepack enable pnpm
```

## 2. 迁移步骤

```
# 1. 删除旧依赖
rm -rf node_modules package-lock.json

# 2. 用 pnpm 安装
pnpm install

# 3. 提交 pnpm-lock.yaml
git add pnpm-lock.yaml
git commit -m "chore: migrate from npm to pnpm"
```

## 3. 常见迁移问题

**问题 1：幽灵依赖报错**

```
// ❌ 原来能跑，pnpm 下报错
import xxx from 'lodash-es'
// 但 package.json 里没写 lodash-es
```

✅ 解决：显式安装缺失依赖

```
pnpm add lodash-es
```

**问题 2：工具链不兼容**

- Webpack 4 / 旧版 Vue CLI 可能需要配置
- 解决方案：升级工具链或配置 `node-linker=hoisted`

------

# 八、最佳实践与注意事项

## ✅ 通用建议

1. 一个项目只用一个包管理器

   - 不要混用 `npm install` 和 `pnpm install`
   - 提交对应的 lock 文件

2. 提交 lock 文件到 Git

   - 保证团队、CI、生产环境依赖一致

3. 使用 `.npmrc` 统一配置

   ```
   # .npmrc
   registry=https://registry.npmmirror.com
   shamefully-hoist=false
   ```

4. CI 中显式指定包管理器

   ```
   # GitHub Actions
   - uses: pnpm/action-setup@v4
     with:
       version: 9
   ```

## ✅ npm 注意事项

- 避免 `npm install <pkg>` 不写 `-D` 导致依赖错放
- 定期 `npm audit` 检查安全漏洞
- 慎用 `npm install -g`，优先项目本地依赖

## ✅ pnpm 注意事项

- **不要手动修改 `node_modules`**

- Monorepo 中善用 `workspace:*` 协议

- 遇到兼容问题时，可临时开启：

  ```
  # .npmrc
  node-linker=hoisted
  ```

- 清理全局存储：

  ```
  pnpm store prune
  ```

# 九、官方文档与链接

## .npmrc 配置官网

- **npm 官方 `.npmrc` 说明**：https://docs.npmjs.com/files/npmrc/
- **npm 配置项总览（config）**：https://docs.npmjs.com/cli/v12/using-npm/config
- **`npm config` 命令页**：https://docs.npmjs.com/cli/v10/commands/npm-config/

> pnpm 也读 `.npmrc`，且扩展了自有字段，pnpm 侧配置说明在：https://pnpm.io/npmrc

## npm 命令官网

- **npm CLI 总入口**：https://docs.npmjs.com/cli
- **CLI 命令列表（install / run / publish 等）**：https://docs.npmjs.com/cli-commands
- 单命令直达格式：`https://docs.npmjs.com/cli/v10/commands/npm-install`（把 `v10` 换成你本地大版本，`npm install` 改成对应子命令即可）

## pnpm 命令官网

- **pnpm 官网首页**：https://pnpm.io/
- **pnpm CLI 总入口**：https://pnpm.io/pnpm-cli
- **单命令示例（`pnpm install`）**：https://pnpm.io/cli/install
- 其他命令按同规律拼：`https://pnpm.io/cli/add`、`/cli/remove`、`/cli/update`、`/cli/run` …
