#!/usr/bin/env node

/**
 * Icon Generator Script for Prayer Times PWA
 * Usage: node generate-icons.js
 * 
 * Requires: npm install canvas
 * If canvas fails to install, use the browser-based icon-generator.html instead
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
try {
  const { createCanvas } = await import('canvas');

  const COLORS = {
    primary: '#1b4332',
    white: '#ffffff',
    green: '#2d6a4f'
  };

  const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
  const MASKABLE_SIZES = [192, 512];
  const SCREENSHOT_SIZES = [
    { width: 540, height: 720, name: 'screenshot-540x720' },
    { width: 1280, height: 720, name: 'screenshot-1280x720' }
  ];

  const iconsDir = path.join(__dirname, 'public', 'icons');
  
  // Create icons directory if it doesn't exist
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  function drawIcon(size, isMaskable = false) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = isMaskable ? COLORS.white : COLORS.primary;
    ctx.fillRect(0, 0, size, size);

    // Draw mosque emoji as icon
    ctx.font = `bold ${size * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isMaskable ? COLORS.primary : COLORS.white;
    ctx.fillText('🕌', size / 2, size / 2);

    return canvas;
  }

  function drawScreenshot(width, height) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, COLORS.primary);
    gradient.addColorStop(1, COLORS.green);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = COLORS.white;
    ctx.font = `bold ${height * 0.08}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('🕌 Prayer Times', width / 2, height * 0.12);

    // Sample prayer time cards
    const cardWidth = width * 0.8;
    const cardHeight = height * 0.1;
    const cardSpacing = height * 0.02;
    let yPos = height * 0.22;

    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    prayers.forEach(prayer => {
      ctx.fillStyle = COLORS.white;
      ctx.fillRect(width * 0.1, yPos, cardWidth, cardHeight);
      
      ctx.fillStyle = COLORS.primary;
      ctx.font = `bold ${height * 0.05}px Arial`;
      ctx.textAlign = 'left';
      ctx.fillText(prayer, width * 0.15, yPos + cardHeight / 2);

      ctx.font = `${height * 0.04}px Arial`;
      ctx.textAlign = 'right';
      ctx.fillText('05:30 AM', width * 0.85, yPos + cardHeight / 2);

      yPos += cardHeight + cardSpacing;
    });

    return canvas;
  }

  // Generate regular icons
  console.log('Generating PWA icons...');
  
  ICON_SIZES.forEach(size => {
    const canvas = drawIcon(size, false);
    const buffer = canvas.toBuffer('image/png');
    const filepath = path.join(iconsDir, `icon-${size}x${size}.png`);
    fs.writeFileSync(filepath, buffer);
    console.log(`✓ Created icon-${size}x${size}.png`);
  });

  // Generate maskable icons
  MASKABLE_SIZES.forEach(size => {
    const canvas = drawIcon(size, true);
    const buffer = canvas.toBuffer('image/png');
    const filepath = path.join(iconsDir, `icon-maskable-${size}x${size}.png`);
    fs.writeFileSync(filepath, buffer);
    console.log(`✓ Created icon-maskable-${size}x${size}.png`);
  });

  // Generate screenshots
  SCREENSHOT_SIZES.forEach(screenshot => {
    const canvas = drawScreenshot(screenshot.width, screenshot.height);
    const buffer = canvas.toBuffer('image/png');
    const filepath = path.join(iconsDir, `${screenshot.name}.png`);
    fs.writeFileSync(filepath, buffer);
    console.log(`✓ Created ${screenshot.name}.png`);
  });

  console.log('\n✅ All icons generated successfully!');
  console.log(`Icons saved to: ${iconsDir}`);

} catch (error) {
  console.error('Canvas module not available. Using fallback method...');
  console.log('\n📝 To generate icons, please do one of the following:\n');
  console.log('Option 1: Install canvas and run this script');
  console.log('  npm install canvas');
  console.log('  node generate-icons.js\n');
  console.log('Option 2: Use the browser-based generator');
  console.log('  1. Open icon-generator.html in a web browser');
  console.log('  2. Click "Generate All Icons"');
  console.log('  3. Download each icon and save to public/icons/\n');
  
  // Create placeholder icons directory
  const iconsDir = path.join(__dirname, 'public', 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }
  
  console.log(`Icons directory created at: ${iconsDir}`);
}
})();
