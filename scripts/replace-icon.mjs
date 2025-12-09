import sharp from 'sharp';
import path from 'path';

const publicIcons = path.resolve(process.cwd(), 'public', 'icons');
const srcIcon = path.join(publicIcons, 'icon.png');

// Resize icon.png to 180x180 and overwrite it for consistent PWA display
await sharp(srcIcon)
  .resize(180, 180)
  .png({ quality: 90 })
  .toFile(srcIcon + '.tmp');

// Replace original with resized version
import fs from 'fs';
fs.renameSync(srcIcon + '.tmp', srcIcon);
console.log('✓ Replaced public/icons/icon.png with 180×180 version');
