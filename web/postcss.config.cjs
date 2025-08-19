// CommonJS config so it loads correctly in Node 18 on Netlify
// (the previous ESM export default in a .cjs file caused the build failure)
/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
