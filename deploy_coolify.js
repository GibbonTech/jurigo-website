const { chromium } = require('playwright');

async function deployToCoolify() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Navigating to Coolify dashboard...');
  await page.goto('http://37.27.62.87:8000/projects');
  
  await page.waitForLoadState('networkidle');
  
  console.log('Looking for login form or dashboard...');
  
  // Check if already logged in
  const loginForm = await page.locator('form').first();
  const dashboardContent = await page.locator('main, .dashboard, .projects').first();
  
  if (await loginForm.isVisible()) {
    console.log('Please log in to Coolify first. The browser will wait for you.');
    await page.waitForSelector('main, .dashboard, .projects', { timeout: 0 });
  }
  
  console.log('Logged in. Looking for new project button...');
  
  // Find and click new project button
  const newProjectBtn = await page.locator('button:has-text("New"), button:has-text("Add"), a:has-text("New Project")').first();
  if (await newProjectBtn.isVisible()) {
    await newProjectBtn.click();
    await page.waitForLoadState('networkidle');
    
    // Look for Git option
    const gitOption = await page.locator('button:has-text("Git"), div:has-text("Git"), [data-testid="git"]').first();
    if (await gitOption.isVisible()) {
      await gitOption.click();
      await page.waitForLoadState('networkidle');
      
      console.log('Please select the jurigo repository and configure deployment settings.');
      console.log('The browser will wait for you to complete the setup.');
      
      // Wait indefinitely for manual completion
      await page.waitForFunction(() => false, { timeout: 0 });
    }
  }
  
  console.log('Browser ready for manual deployment setup.');
}

deployToCoolify().catch(console.error);
