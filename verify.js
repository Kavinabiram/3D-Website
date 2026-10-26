import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--enable-webgl', '--use-gl=swiftshader', '--no-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Capture console messages from the page
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  // Set viewport
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log('Navigating to http://localhost:5173...');
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 15000 });
    console.log('Page loaded. Waiting for 3D to render...');
    
    // Wait a few seconds for R3F to render
    await new Promise(r => setTimeout(r, 4000));
    
    console.log('Taking screenshot...');
    await page.screenshot({ path: 'screenshot.png' });
    console.log('Screenshot saved to screenshot.png');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await browser.close();
    console.log('Done.');
  }
})();
