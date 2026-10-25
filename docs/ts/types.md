# TypeScript 数据类型

# 一、相比 JS 新增的基础类型

JavaScript 已有："string" "number" "boolean" "null" "undefined" "bigint" "symbol" "object"

TypeScript 额外增加：

- "any"：任意类型，跳过类型检查（尽量别用）
- "unknown"：类型安全的 any，使用前必须先收窄类型
- "void"：函数无返回值
- "never"：永远不可能有值（如抛错函数、穷尽判断）
- "tuple"：固定长度、固定位置的数组，如 "[string, number]"
- "enum"：枚举（数字枚举 / 字符串枚举 / const enum）

```javascript
let v: unknown = 10;
v = "hi";

function fail(): never {
  throw new Error("boom");
}

let user: [string, number] = ["Tom", 18];

enum Role {
  Admin = "ADMIN",
  User = "USER",
}
```

# 二、TS 的类型组合能力（不是“运行时类型”，但是新语法）

- 联合类型： `string | number`
- 交叉类型： `A & B`
- 字面量类型： `"left" | "right" | 1 | 2`
- 类型别名： `type`
- 接口： `interface`
- 泛型： `Array<T>`、`Box<T>`
- 函数类型： `(a: number) => string`
- 索引访问： `T[K]`、`keyof T`

```javascript
type Status = "loading" | "success" | "error";

type User = {
  id: number;
  name: string;
  age?: number; // 可选
};

interface Animal {
  kind: string;
}

type Dog = Animal & { bark(): void };
```

# 三、TS 4.x / 5.x 较新的类型特性

- 模板字面量类型（4.1）

```javascript
type Method = "GET" | "POST";
type Api = `${Method} /users`;
```

- "satisfies" 操作符（4.9）：校验类型但不丢失字面量推导

```javascript
const colors = {
  primary: "#0070f3",
} satisfies Record<string, string>;

colors.primary; // 类型仍是 "#0070f3"
```

- "const" 类型参数（5.0）：保留字面量元组，不用到处写 "as const"

```javascript
function keys<T extends readonly string[]>(k: T): T {
  return k;
}
keys(["a", "b"]); // readonly ["a", "b"]
```

- 装饰器元数据（5.2+，TC39 标准装饰器）

# 四、内置工具类型（基于泛型封装）

`Partial<T>` `Required<T>` `Readonly<T>` `Pick<T, K>` `Omit<T, K>` `Record<K, V>` `ReturnType<T>` `Parameters<T>` 等。

一句话总结：

**JS给值，TS 给“值的约束”**——新增的核心是 `any/unknown/void/never/tuple/enum` + 联合/交叉/字面量/泛型/接口，再叠加模板字面量和 "satisfies" 这类现代类型编程能力。

# TypeScript 类型断言

TypeScript 的类型断言是“告诉编译器：我相信这个值就是这个类型”，它只在编译期生效，运行时不产生任何代码。

- 两种写法

```typescript
let value: unknown = "hello";

// 尖括号语法（不推荐，JSX 冲突）
let len1 = (<string>value).length;

// as 语法（推荐）
let len2 = (value as string).length;
```

- 编译通过，运行报错

```typescript
let value: unknown = 123;

(value as string).toUpperCase(); // ✅ 编译通过
value.toUpperCase(); // ❌ 运行报错 123.toUpperCase is not a function
```

👉 类型断言不会做任何运行时检查或转换