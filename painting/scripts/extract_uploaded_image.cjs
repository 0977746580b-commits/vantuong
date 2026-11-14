const fs = require('fs');
const path = require('path');

const jsonlPath = 'C:\\Users\\pc\\.claude\\projects\\C--Users-pc-OneDrive-Desktop-painting\\a189eb52-d988-4061-9fb9-4402fdb298ff.jsonl';
console.log('Reading jsonl:', jsonlPath);

// Read the last 20MB of the file if it's large
const stats = fs.statSync(jsonlPath);
const bufferSize = Math.min(stats.size, 15 * 1024 * 1024);
const fd = fs.openSync(jsonlPath, 'r');
const buf = Buffer.alloc(bufferSize);
fs.readSync(fd, buf, 0, bufferSize, stats.size - bufferSize);
fs.closeSync(fd);

const text = buf.toString('utf8');
const lines = text.split('\n');

console.log('Total read lines:', lines.length);

let foundImage = null;

// Search backwards for the most recent message with an image
for (let i = lines.length - 1; i >= 0; i--) {
  const line = lines[i].trim();
  if (!line) continue;
  try {
    const data = JSON.parse(line);
    // Find image blocks in user message content
    const msg = data.message || data;
    const content = msg.content || (data.params && data.params.content);
    if (Array.isArray(content)) {
      for (const item of content) {
        if (item.type === 'image' && item.source && item.source.data) {
          foundImage = item.source;
          console.log(`Found image at line index ${i}, media_type: ${item.source.media_type}`);
          break;
        }
      }
    }
    if (foundImage) break;
  } catch (e) {
    // line might be partial due to buffer slice
  }
}

if (foundImage) {
  const outPath = path.join(__dirname, '..', 'public', 'assets', 'stage4_5_steps_new.png');
  fs.writeFileSync(outPath, Buffer.from(foundImage.data, 'base64'));
  console.log('Successfully saved to:', outPath);
  console.log('File size:', fs.statSync(outPath).size, 'bytes');
} else {
  console.log('No image found in recent jsonl lines');
}
