import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();

page.on('console', msg => {
  if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
});
page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

await page.setViewport({ width: 1440, height: 900 });

console.log('Navigating to /axiome/process...');
await page.goto('http://localhost:4173/axiome/process', { waitUntil: 'networkidle0', timeout: 15000 });

// Wait for WebGL to render
await new Promise(r => setTimeout(r, 3000));

// Check canvas elements
const canvasCount = await page.$$eval('canvas', els => els.length);
console.log('Canvas elements found:', canvasCount);

// Check if canvases have non-zero dimensions
const canvasInfo = await page.$$eval('canvas', els => els.map(c => ({
  width: c.width,
  height: c.height,
  clientWidth: c.clientWidth,
  clientHeight: c.clientHeight,
  parentClass: c.parentElement?.className || 'none',
  isVisible: c.clientWidth > 0 && c.clientHeight > 0
})));
console.log('Canvas details:', JSON.stringify(canvasInfo, null, 2));

// Screenshot
await page.screenshot({ path: 'verify_screenshot.png', fullPage: false });
console.log('Screenshot saved to verify_screenshot.png');

await browser.close();
process.exit(0);
