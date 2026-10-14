const { defineConfig } = require('@playwright/test');
const onlyBrowser = process.argv.includes('--project=browser');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 20000,
  workers: 1,
  reporter: 'list',
  projects: [
    { name: 'browser', testMatch: 'frontend.spec.js' },
    { name: 'electron', testMatch: 'electron.spec.js' },
  ],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 1440, height: 1000 },
    launchOptions: process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
  },
  webServer: [
    { command: 'node tests/server.js', url: 'http://127.0.0.1:4173/main.html', reuseExistingServer: false },
    ...onlyBrowser ? [] : [{ command: 'node tests/backend-server.js', url: 'http://127.0.0.1:8000/get-records/', reuseExistingServer: false }],
  ],
});
