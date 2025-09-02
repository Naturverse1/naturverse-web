#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const NAVATAR_DIR = path.join(__dirname, '..', 'public', 'navatars');
const OUT_FILE = path.join(__dirname, '..', 'public', 'navatar-catalog.json');

function titleCase(str) {
  return str.replace(/[-_]/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
}

const files = fs.readdirSync(NAVATAR_DIR).filter(f => /\.(png|jpe?g|svg)$/i.test(f));
const catalog = files.map(file => {
  const base = file.replace(/\.(png|jpe?g|svg)$/i, '');
  return {
    key: base.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: titleCase(base),
    tags: base.split(/[-_ ]+/).map(t => t.toLowerCase()).filter(Boolean),
    image_url: `/navatars/${file}`
  };
});

fs.writeFileSync(OUT_FILE, JSON.stringify(catalog, null, 2));
console.log(`Generated navatar catalog with ${catalog.length} entries.`);
