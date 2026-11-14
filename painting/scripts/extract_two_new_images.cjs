const fs = require('fs');
const path = require('path');

const jsonlPath = 'C:\\Users\\pc\\.claude\\projects\\C--Users-pc-OneDrive-Desktop-painting\\a189eb52-d988-4061-9fb9-4402fdb298ff.jsonl';
console.log('Reading jsonl:', jsonlPath);

const stats = fs.statSync(jsonlPath);
const bufferSize = Math.min(stats.size, 20 * 1024 * 1024);
const fd = fs.openSync(jsonlPath, 'r');
const buf = Buffer.alloc(bufferSize);
fs.readSync(fd, buf, 0, bufferSize, stats.size - bufferSize);
fs.closeSync(fd);

const text = buf.toString('utf8');
const lines = text.split('\n');

console.log('Total lines read:', lines.length);

let imageList = [];

// Search from bottom up for the user message that contains 2 images
for (let i = lines.length - 1; i >= 0; i--) {
  const line = lines[i].trim();
  if (!line) continue;
  try {
    const data = JSON.parse(line);
    const msg = data.message || data;
    const content = msg.content || (data.params && data.params.content);
    if (Array.isArray(content)) {
      const imagesInMsg = content.filter(item => item.type === 'image' && item.source && item.source.data);
      if (imagesInMsg.length >= 2) {
        console.log(`Found message at line ${i} with ${imagesInMsg.length} images!`);
        imageList = imagesInMsg;
        break;
      }
    }
  } catch (e) {}
}

const outDir = path.join(__dirname, '..', 'public', 'assets');
fs.mkdirSync(outDir, { recursive: true });

if (imageList.length >= 2) {
  // Image 1: Bộ dụng cụ (5 món: Giấy dó, Mực Tàu, Ván khắc, Con lăn mực, Bút lông)
  const path1 = path.join(outDir, 'inventory_props_new.png');
  fs.writeFileSync(path1, Buffer.from(imageList[0].source.data, 'base64'));
  console.log('Saved Image 1 (bộ dụng cụ) to:', path1, fs.statSync(path1).size, 'bytes');

  // Image 2: Các bước làm tranh (5 bước với con lăn mực)
  const path2 = path.join(outDir, 'stage4_printing_steps_new.png');
  fs.writeFileSync(path2, Buffer.from(imageList[1].source.data, 'base64'));
  console.log('Saved Image 2 (5 bước làm tranh) to:', path2, fs.statSync(path2).size, 'bytes');
} else {
  console.log('Could not find 2 images in one message, total images found:', imageList.length);
}
