// Génère le jeu d'icônes et l'image Open Graph à partir du logo source.
// Usage : node scripts/gen-icons.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SRC = 'assets/Logo-sphere.jpg'; // PNG transparent 1024×1024
const OUT = 'public';
const NAVY = { r: 5, g: 11, b: 43, alpha: 1 }; // #050B2B

await mkdir(OUT, { recursive: true });

/** Logo centré sur un fond navy carré aux coins arrondis. */
async function iconOnNavy(size, pad = Math.round(size * 0.16)) {
  const radius = Math.round(size * 0.22);
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}"/></svg>`,
  );
  const logo = await sharp(SRC)
    .resize(size - pad * 2, size - pad * 2, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  return sharp({ create: { width: size, height: size, channels: 4, background: NAVY } })
    .composite([
      { input: logo, gravity: 'center' },
      { input: mask, blend: 'dest-in' },
    ])
    .png()
    .toBuffer();
}

const iconTargets = [
  ['favicon-16x16.png', 16],
  ['favicon-32x32.png', 32],
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
];

for (const [name, size] of iconTargets) {
  const buf = await iconOnNavy(size, Math.round(size * (size <= 32 ? 0.08 : 0.16)));
  await sharp(buf).toFile(`${OUT}/${name}`);
  console.log(`✓ ${name} (${size}×${size})`);
}

// Image Open Graph : 1200×630, fond navy + halo + logo + wordmark + baseline.
const OG_W = 1200;
const OG_H = 630;
const logoOg = await sharp(SRC).resize(360, 360, { fit: 'contain' }).toBuffer();
const textOg = Buffer.from(`
  <svg width="${OG_W}" height="${OG_H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="halo" cx="30%" cy="35%" r="60%">
        <stop offset="0%" stop-color="#5B3DF6" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#050B2B" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${OG_W}" height="${OG_H}" fill="#050B2B"/>
    <rect width="${OG_W}" height="${OG_H}" fill="url(#halo)"/>
    <text x="560" y="300" font-family="Poppins, Arial, sans-serif" font-size="64" font-weight="700" fill="#FFFFFF">Kaylow Sphere</text>
    <text x="560" y="360" font-family="Inter, Arial, sans-serif" font-size="30" fill="#22D3EE">Développeur web freelance fullstack</text>
    <text x="560" y="418" font-family="Inter, Arial, sans-serif" font-size="26" fill="#9AA3B2">Le centre de gravité de votre projet web.</text>
  </svg>`);

await sharp({ create: { width: OG_W, height: OG_H, channels: 4, background: NAVY } })
  .composite([
    { input: textOg, top: 0, left: 0 },
    { input: logoOg, top: 135, left: 120 },
  ])
  .png()
  .toFile(`${OUT}/og-image.png`);
console.log('✓ og-image.png (1200×630)');
