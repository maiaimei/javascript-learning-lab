/** @type {import("prettier").Config} */
module.exports = {
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  semi: true,
  printWidth: 100,
  trailingComma: 'es5',
  arrowParens: 'avoid',
  bracketSpacing: true,
  bracketSameLine: false,
  htmlWhitespaceSensitivity: 'css',
  embeddedLanguageFormatting: 'auto',
  endOfLine: 'lf',
  // 忽略解析错误，避免部分特殊文件阻断格式化
  proseWrap: 'preserve',
  // 不自动在markdown文件强制换行
  overrides: [
    {
      // 针对html文件单独微调（可选）
      files: '*.html',
      options: {
        printWidth: 120,
      },
    },
  ],
};
