import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicIcons = path.resolve(process.cwd(), 'public', 'icons');
const sourceCandidates = [
  path.join(publicIcons, 'source.png'),
  path.join(publicIcons, 'app-icon.png'),
  path.join(publicIcons, 'icon.png')
];

async function findSource() {
  for (const p of sourceCandidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function ensureDir() {
  if (!fs.existsSync(publicIcons)) fs.mkdirSync(publicIcons, { recursive: true });
}

async function gen() {
  await ensureDir();
  const src = await findSource();
  if (!src) {
    console.error('No source icon found. Put your source image as public/icons/source.png (PNG recommended).');
    process.exit(1);
  }

  const sizes = [72,96,128,144,152,192,384,512];

  for (const s of sizes) {
    const out = path.join(publicIcons, `icon-${s}x${s}.png`);
    await sharp(src).resize(s, s).png({ quality: 90 }).toFile(out);
    console.log('Generated', out);
  }

  // generate maskable versions (simply same images) for 192 and 512
  await sharp(src).resize(192,192).png({ quality: 90 }).toFile(path.join(publicIcons, 'icon-192x192-maskable.png'));
  await sharp(src).resize(512,512).png({ quality: 90 }).toFile(path.join(publicIcons, 'icon-512x512-maskable.png'));
  console.log('Generated maskable icons');

  // generate a favicon 32x32
  await sharp(src).resize(32,32).png({ quality: 90 }).toFile(path.join(publicIcons, 'favicon-32x32.png'));
  console.log('Generated favicon-32x32.png');

  // optionally copy a default icon.png, but avoid overwriting the source file
  const destIcon = path.join(publicIcons, 'icon.png');
  if (path.resolve(src) === path.resolve(destIcon)) {
    console.log('Source is already public/icons/icon.png — skipping overwrite of icon.png');
  } else {
    await sharp(src).resize(180,180).png({ quality: 90 }).toFile(destIcon);
    console.log('Generated icon.png');
  }

  console.log('\nAll icons generated in public/icons.');
}

gen().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
