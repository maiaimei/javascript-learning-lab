# TypeScript Compiler（TypeScript 编译器）

## 一、tsc 是什么？

`tsc` 是 **TypeScript Compiler（TypeScript 编译器）** 的命令行工具，作用是把 `.ts` 文件编译成 `.js` 文件。

- `tsc` = TypeScript 的官方编译器
- 输入：`.ts` / `.tsx`
- 输出：`.js`（可指定 ES5 / ES6 / CommonJS / ESM 等）
- 同时负责：**类型检查**（即使不生成 JS）

---

## 二、先确认 tsc 是否可用

```bash
tsc --version
```

如果报 `command not found`，说明 TypeScript 没装或没进 PATH。使用 pnpm 安装 typescript：

```bash
pnpm add -D typescript
```

---

## 三、最常用命令

### 1️⃣ 编译单个文件
```bash
tsc hello.ts
```
生成：
```text
hello.ts → hello.js
```

---

### 2️⃣ 监听模式（改代码自动编译，学习神器）
```bash
tsc hello.ts --watch
# 简写
tsc hello.ts -w

# 递归监听子目录，但前提是这些文件在tsconfig.json的 include / files 范围内，且没有被 exclude 排除。
tsc -w
```

---

### 3️⃣ 只做类型检查，不生成 JS（强烈推荐）
```bash
tsc --noEmit
```

---

### 4️⃣ 使用 tsconfig.json（项目级）
初始化：
```bash
tsc --init
```

然后直接运行：
```bash
tsc
```

会根据 `tsconfig.json` 编译整个项目。

---

## 四、tsconfig.json 最小可用配置（学习推荐）

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "noEmitOnError": true
  },
  "include": ["src"]
}
```

目录结构示例：
```text
project/
├── src/
│   └── index.ts
├── dist/
│   └── index.js
└── tsconfig.json
```

编译：
```bash
tsc
```

---

## 五、tsc vs tsx（别搞混）

| 工具 | 用途 |
|---|---|
| `tsc` | 编译 `.ts` → `.js`（官方） |
| `tsx` | 直接运行 `.ts`（不生成 JS，开发体验好） |

学习阶段推荐组合：
```bash
# 学类型 / 语法
tsc --noEmit

# 想立刻看运行结果
tsx index.ts
```

---

## 六、常见报错 & 解决

### ❌ `tsc: command not found`
✅ 用：
```bash
pnpm exec tsc
npx tsc
```

---

### ❌ 改了代码没变化
✅ 检查：
- 是否跑了 `tsc -w`
- 是否在看 `dist/index.js` 而不是 `src/index.ts`

---

### ❌ 类型报错但你想先跑起来
临时关闭严格检查：
```bash
tsc --noStrict
```
（不建议长期关，学习时可以理解差异）
