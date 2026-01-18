const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'init', 'data.js');
let content = fs.readFileSync(dataFile, 'utf8');

// Replace all placeholder URLs with local image paths
// Pattern: https://via.placeholder.com/800x400?text=...
const placeholderRegex = /https:\/\/via\.placeholder\.com\/[^"]+/g;
let imageCounter = 1;

content = content.replace(placeholderRegex, match => {
  const imagePath = `/images/whatsapp-${String(imageCounter).padStart(3, '0')}.jpeg`;
  imageCounter++;
  return imagePath;
});

fs.writeFileSync(dataFile, content, 'utf8');
console.log(`✓ Replaced ${imageCounter - 1} placeholder URLs with local image paths`);
