import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  
  console.log('Navigating...');
  await page.goto('http://localhost:4173/axiome/process', { waitUntil: 'networkidle0' });
  
  const moltenBackground = await page.$('.molten-background-container canvas');
  console.log('Molten Background Canvas exists:', !!moltenBackground);
  
  if (moltenBackground) {
    const box = await moltenBackground.boundingBox();
    console.log('Molten Background Canvas Box:', box);
  }

  const fluidTabs = await page.$$('.fluid-tab-canvas-wrapper canvas');
  console.log('Fluid Tabs Canvas Count:', fluidTabs.length);
  
  if (fluidTabs.length > 0) {
    const box = await fluidTabs[0].boundingBox();
    console.log('First Fluid Tab Canvas Box:', box);
  }

  await browser.close();
})();
