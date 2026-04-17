const puppeteer = require('puppeteer');
const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');

async function run() {
  console.log("Starting build server...");
  const devProcess = spawn('npx', ['vite', 'preview', '--port', '4173'], { stdio: 'inherit' });
  
  // Give it 3 seconds to spin up
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log("Launching browser for screenshot test...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4173/axiome/process', { waitUntil: 'networkidle0', timeout: 15000 });
  
  // Wait another 3s for WebGL
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await page.screenshot({ path: 'local_test.png' });
  console.log("Screenshot saved as local_test.png");
  
  await browser.close();
  devProcess.kill();
  process.exit(0);
}

run().catch(console.error);
