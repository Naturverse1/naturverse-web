// CommonJS to avoid ESM runtime errors in Node 18 on Netlify
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
