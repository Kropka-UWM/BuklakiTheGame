const { test, expect } = require('@playwright/test');

async function click(page, action) {
  const link = page.locator(`.curr-menu [data-action="${action}"]`);
  const target = await link.locator('span').count() ? link.locator('span').first() : link;
  await target.hover();
  await target.click();
  if (action === 'new-game') {
    await page.waitForURL('**/game.html');
    await expect(page.locator('.phase').first()).toBeAttached();
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/main.html');
  await expect(page.locator('#menu')).toHaveClass(/curr-menu/);
});

test('menu, instructions and return by keyboard', async ({ page }) => {
  await click(page, 'instructions');
  await expect(page.locator('#instructions')).toHaveClass(/curr-menu/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#menu')).toHaveClass(/curr-menu/);
  await click(page, 'about');
  await expect(page.locator('#about')).toHaveClass(/curr-menu/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#menu')).toHaveClass(/curr-menu/);
});

test('settings persist into the game', async ({ page }) => {
  await click(page, 'settings');
  await click(page, 'basket');
  await click(page, 'distance');
  await click(page, 'to-menu');
  await click(page, 'new-game');
  await expect(page.locator('.phase')).toHaveCount(9);
  await expect(page.locator('#basket-amount span')).toHaveText('6');
});

test('English translation persists on reload', async ({ page }) => {
  await click(page, 'settings');
  await click(page, 'language');
  await expect(page.locator('#options h1')).toHaveText('Options');
  await page.reload();
  await expect(page.locator('[data-action="new-game"]')).toHaveText('New game');
});

test('movement consumes water and oasis refills it', async ({ page }) => {
  await click(page, 'new-game');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#basket-amount span')).toHaveText('4');
  await expect(page.locator('[data-step="1"] .top')).toHaveText('X');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#basket-amount span')).toHaveText('5');
  await expect(page.locator('[data-step="1"] .top')).toBeEmpty();
});

test('bury and recover water', async ({ page }) => {
  await click(page, 'new-game');
  await page.keyboard.press('d');
  await page.keyboard.press('s');
  await expect(page.locator('[data-step="1"] .bottom')).toHaveText('1');
  await expect(page.locator('#basket-amount span')).toHaveText('3');
  await page.keyboard.press('w');
  await expect(page.locator('[data-step="1"] .bottom')).toHaveText('0');
  await expect(page.locator('#basket-amount span')).toHaveText('4');
});

test('pause freezes movement and Escape resumes', async ({ page }) => {
  await click(page, 'new-game');
  await page.keyboard.press('Escape');
  await expect(page.locator('#pause')).toHaveClass(/curr-menu/);
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#basket-amount span')).toHaveText('5');
  await page.keyboard.press('Escape');
  await expect(page.locator('#status')).toHaveClass(/curr-menu/);
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#basket-amount span')).toHaveText('4');
});

test('water exhaustion ends the game', async ({ page }) => {
  await click(page, 'new-game');
  for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowRight');
  await expect(page.locator('#gameover')).toHaveClass(/curr-menu/);
  await expect(page.locator('#basket-amount span')).toHaveText('0');
});

test('short route wins with the same day count', async ({ page, context }) => {
  await context.addCookies([{ name: 'distance', value: '2', url: 'http://127.0.0.1:4173' }]);
  await click(page, 'new-game');
  for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight');
  await expect(page.locator('#success')).toHaveClass(/curr-menu/);
  await expect(page.locator('#days')).toHaveText('3');
});

test('ranking displays player names as text', async ({ page }) => {
  const name = '<img src=x onerror="window.injected=true">';
  await page.route('**/get-records/', route => route.fulfill({ json: [{ name, days: 3, distance: 2 }] }));
  await click(page, 'ranking');
  await expect(page.locator('#ranking-list')).toContainText(name);
  await expect(page.locator('#ranking-list img')).toHaveCount(0);
  expect(await page.evaluate(() => window.injected)).toBeUndefined();
});

test('confirmation waits for a successful score save', async ({ page, context }) => {
  await context.addCookies([{ name: 'distance', value: '2', url: 'http://127.0.0.1:4173' }]);
  await click(page, 'new-game');
  for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight');
  await expect(page.locator('#success')).toHaveClass(/curr-menu/);
  let release, receive;
  const gate = new Promise(resolve => { release = resolve; });
  const posted = new Promise(resolve => { receive = resolve; });
  await page.route('**/handle-record/', async route => {
    receive(route.request().postData());
    await gate;
    await route.fulfill({ json: { is_finished: true } });
  });
  await click(page, 'confirm');
  expect(new URLSearchParams(await posted).get('days')).toBe('3');
  await expect(page.locator('#success')).toHaveClass(/curr-menu/);
  release();
  await page.waitForURL('**/main.html');
});

test('failed score save keeps the result and permits retry', async ({ page, context }) => {
  await context.addCookies([{ name: 'distance', value: '2', url: 'http://127.0.0.1:4173' }]);
  await click(page, 'new-game');
  for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight');
  await expect(page.locator('#success')).toHaveClass(/curr-menu/);
  await page.route('**/handle-record/', route => route.fulfill({ json: { is_finished: false } }));
  await click(page, 'confirm');
  await expect(page.locator('#score-error')).toContainText('Nie udało się zapisać');
  await expect(page.locator('#success')).toHaveClass(/curr-menu/);
  await page.unroute('**/handle-record/');
  await page.route('**/handle-record/', route => route.fulfill({ json: { is_finished: true } }));
  await click(page, 'confirm');
  await page.waitForURL('**/main.html');
});
