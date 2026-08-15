const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processLogo() {
  const inputPath = path.join(__dirname, '../public/images/logo.jpg');
  const outputPngPath = path.join(__dirname, '../public/images/logo.png');
  const appIconPath = path.join(__dirname, '../src/app/icon.png');
  const appAppleIconPath = path.join(__dirname, '../src/app/apple-icon.png');

  // Load raw image buffer
  const image = sharp(inputPath);
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  // Make pure white background transparent
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // If near white (r, g, b > 245), set alpha to 0
    if (r > 240 && g > 240 && b > 240) {
      data[i + 3] = 0;
    }
  }

  // Save transparent PNG
  const transparentLogo = sharp(data, {
    raw: {
      width,
      height,
      channels: 4,
    },
  });

  await transparentLogo.png().toFile(outputPngPath);
  console.log('Saved transparent logo to', outputPngPath);

  // Also trim and resize for crisp favicon
  await transparentLogo
    .clone()
    .trim()
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(appIconPath);
  console.log('Saved favicon to', appIconPath);

  await transparentLogo
    .clone()
    .trim()
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(appAppleIconPath);
  console.log('Saved apple icon to', appAppleIconPath);
}

processLogo().catch(console.error);
