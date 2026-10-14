const { test, expect, _electron: electron } = require('@playwright/test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

let app, page, profile;
const root = path.resolve(process.env.GAME_ROOT || path.join(__dirname, '..'));
const electronPath = process.env.ELECTRON_PATH || require(path.join(root, 'node_modules/electron'));

async function click(action) {
  const link = page.locator(`.curr-menu [data-action="${action}"]`);
  const target = await link.locator('span').count() ? link.locator('span').first() : link;
  await target.hover();
  await target.click();
  if (action === 'new-game') {
    await page.waitForURL('**/game.html');
    await expect(page.locator('.phase').first()).toBeAttached();
  }
}

test.beforeEach(async () => {
  profile = fs.mkdtempSync(path.join(os.tmpdir(), 'buklaki-test-'));
  app = await electron.launch({
    executablePath: electronPath,
    args: [root, `--user-data-dir=${profile}`],
  });
  page = await app.firstWindow();
  await page.waitForLoadState();
  await expect(page.locator('#menu')).toHaveClass(/curr-menu/);
});

test.afterEach(async () => {
  if (app) await app.close();
  fs.rmSync(profile, { recursive: true, force: true });
});

test('desktop window loads the menu without JavaScript errors', async () => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.reload();
  await expect(page.locator('[data-action="new-game"]')).toBeVisible();
  expect(errors).toEqual([]);
});

test('desktop movement and pause', async () => {
  await click('new-game');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#basket-amount span')).toHaveText('4');
  await page.keyboard.press('Escape');
  await expect(page.locator('#pause')).toHaveClass(/curr-menu/);
});

test('desktop settings persist and a winning score reaches Django', async ({ request }) => {
  const before = (await (await request.get('http://127.0.0.1:8000/get-records/')).json()).length;
  await click('settings');
  for (let i = 0; i < 4; i++) await click('distance');
  await click('to-menu');
  await click('new-game');
  await expect(page.locator('.phase')).toHaveCount(2);
  for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight');
  await expect(page.locator('#success')).toHaveClass(/curr-menu/);
  await expect(page.locator('#days')).toHaveText('3');
  await click('confirm');
  await page.waitForURL('**/main.html');
  const rows = await (await request.get('http://127.0.0.1:8000/get-records/')).json();
  expect(rows.length).toBe(before + 1);
  expect(rows.at(-1)).toMatchObject({ name: 'ABC', days: 3, distance: 2, basket_amount: 3 });
});

test('desktop ranking reads actual Django records', async ({ request }) => {
  await request.post('http://127.0.0.1:8000/handle-record/', {
    form: { name: 'Desktop-ranking-test', days: 3, distance: 2, basket_amount: 3 },
  });
  await click('ranking');
  await expect(page.locator('#ranking-list')).toContainText('Desktop-ranking-test');
});

test('desktop language and distance survive an application restart', async () => {
  await click('settings');
  await click('distance');
  await click('language');
  await app.evaluate(({ session }) => session.defaultSession.flushStorageData());
  await app.close();
  app = await electron.launch({
    executablePath: electronPath,
    args: [root, `--user-data-dir=${profile}`],
  });
  page = await app.firstWindow();
  await page.waitForLoadState();
  await expect(page.locator('[data-action="new-game"]')).toHaveText('New game');
  await click('settings');
  await expect(page.locator('.distance-set')).toHaveText('9');
});
