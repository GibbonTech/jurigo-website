const { chromium } = require('playwright');

async function openCoolify() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Opening Coolify dashboard...');
  await page.goto('http://37.27.62.87:8000/projects');
  
  console.log('Coolify dashboard opened successfully!');
  console.log('You can now log in and deploy the jurigo project.');
  
  // Keep the browser open for user interaction
  console.log('Browser will remain open. Press Ctrl+C to close.');
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Closing browser...');
    await browser.close();
    process.exit(0);
  });
}

openCoolify().catch(console.error);
