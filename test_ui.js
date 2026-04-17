import { launch } from 'puppeteer';
import { spawn } from 'child_process';
import { writeFileSync } from 'fs';

async function run() {
  console.log("Starting server...");
  const devProcess = spawn('npx.cmd', ['vite', 'preview', '--port', '4173'], { stdio: 'inherit' });
  
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  console.log("Launching test");
  const browser = await launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4173/axiome/process', { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await page.screenshot({ path: 'local_test.png' });
  
  const content = await page.content();
  writeFileSync('test_dom.html', content);

  console.log("Screenshot and DOM saved.");
  
  await browser.close();
  devProcess.kill();
  process.exit(0);
}

run().catch(console.error);
