/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  singleQuote: false,
  endOfLine: "auto",
  trailingComma: "all",
  tabWidth: 2,
  semi: true,
};
