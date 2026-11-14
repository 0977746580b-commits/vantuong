const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'downloaded_assets', 'extracted', 'images');
const files = fs.readdirSync(imgDir).filter(f => f.endsWith('.png'));

files.sort((a, b) => {
  const numA = parseInt(a.replace(/\D/g, ''), 10);
  const numB = parseInt(b.replace(/\D/g, ''), 10);
  return numA - numB;
});

for (const file of files) {
  const filePath = path.join(imgDir, file);
  const buf = fs.readFileSync(filePath);
  if (buf.slice(0, 8).toString('hex') === '89504e470d0a1a0a') {
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    const sizeKb = (fs.statSync(filePath).size / 1024).toFixed(1);
    console.log(`${file.padEnd(14)} : ${width}x${height} (${sizeKb} KB)`);
  }
}
