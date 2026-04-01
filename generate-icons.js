// Simple script to generate PNG icons for the Chrome extension
// Run with: node generate-icons.js

const fs = require('fs');
const path = require('path');

// Simple 1x1 emerald green PNG as base (will be scaled by Chrome)
// For production, use a proper icon generator

// Minimal valid PNG (emerald green #10b981)
const createSimplePNG = (size) => {
  // PNG header
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR chunk
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0); // length
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(size, 8);  // width
  ihdr.writeUInt32BE(size, 12); // height
  ihdr.writeUInt8(8, 16);  // bit depth
  ihdr.writeUInt8(2, 17);  // color type (RGB)
  ihdr.writeUInt8(0, 18);  // compression
  ihdr.writeUInt8(0, 19);  // filter
  ihdr.writeUInt8(0, 20);  // interlace

  // Calculate CRC for IHDR
  const ihdrData = ihdr.slice(4, 21);
  const ihdrCrc = crc32(ihdrData);
  ihdr.writeUInt32BE(ihdrCrc, 21);

  // IDAT chunk (compressed image data - solid color)
  // For simplicity, create uncompressed solid color
  const rawData = [];
  for (let y = 0; y < size; y++) {
    rawData.push(0); // filter byte
    for (let x = 0; x < size; x++) {
      rawData.push(0x10, 0xB9, 0x81); // RGB emerald green
    }
  }

  const zlib = require('zlib');
  const compressed = zlib.deflateSync(Buffer.from(rawData));

  const idat = Buffer.alloc(compressed.length + 12);
  idat.writeUInt32BE(compressed.length, 0);
  idat.write('IDAT', 4);
  compressed.copy(idat, 8);
  const idatCrc = crc32(Buffer.concat([Buffer.from('IDAT'), compressed]));
  idat.writeUInt32BE(idatCrc, compressed.length + 8);

  // IEND chunk
  const iend = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82]);

  return Buffer.concat([signature, ihdr, idat, iend]);
};

// CRC32 calculation
function crc32(data) {
  let crc = 0xFFFFFFFF;
  const table = [];

  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }

  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }

  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Generate icons
const sizes = [16, 48, 128];
const iconsDir = path.join(__dirname, 'icons');

sizes.forEach(size => {
  const png = createSimplePNG(size);
  fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), png);
  console.log(`Generated icon${size}.png`);
});

console.log('Icons generated successfully!');
