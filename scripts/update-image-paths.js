const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'init', 'data.js');
let content = fs.readFileSync(file, 'utf8');
const regex = /\/images\/WhatsApp[^\"]+?\.jpeg/g;
let i = 1;
const seen = new Set();
content = content.replace(regex, match => {
  if (seen.has(match)) return match; // if same file reused, keep first mapping
  const name = `/images/whatsapp-${String(i).padStart(3,'0')}.jpeg`;
  i++;
  seen.add(match);
  return name;
});
fs.writeFileSync(file, content, 'utf8');
console.log('Replaced', i-1, 'unique image paths in', file);