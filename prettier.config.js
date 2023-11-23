/** @type {import("prettier").Config} */
export default {
  trailingComma: 'all',
  semi: true,
  singleQuote: true,
  arrowParens: 'avoid',
  printWidth: 120,
  bracketSameLine: false,
  htmlWhitespaceSensitivity: 'strict',
  endOfLine: 'lf',
  plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-organize-imports'],
};
