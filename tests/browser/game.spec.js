import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Keep browser regressions reproducible; production still uses Math.random.
  await page.addInitScript(() => {
    let seed = 42;
    Math.random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 2 ** 32;
    };
  });
});

async function playAction(page) {
  const action = page.locator('#actions button:not(:disabled)').first();
  if (await action.count()) await action.click();
  else await page.locator('#hand button:not(:disabled)').first().click();
}

function collectErrors(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  return errors;
}

test('a full 24-deal game is playable by mouse without errors, then can restart', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Take a seat' })).toBeVisible();
  await expect(page.locator('#hand button')).toHaveCount(0);
  await page.screenshot({ path: 'test-results/desktop-table.png', fullPage: true });
  for (let i = 0; i < 500; i++) {
    if ((await page.locator('#status').textContent()).startsWith('Game complete.')) break;
    await playAction(page);
  }
  await expect(page.locator('#status')).toContainText('Game complete.');
  await expect(page.locator('#history li')).toHaveCount(24);
  await expect(page.locator('#hand button')).toHaveCount(0);
  await page.getByRole('button', { name: 'Play again' }).click();
  await expect(page.getByRole('button', { name: 'Take a seat' })).toBeVisible();
  await expect(page.locator('#history li')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('keyboard bidding including 6 and keyboard card selection work; restart clears state', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');
  for (let i = 0; i < 200; i++) {
    if (await page.locator('#actions button[data-bid="6"]:not(:disabled)').count()) break;
    await playAction(page);
  }
  await expect(page.getByRole('button', { name: 'Call 6', exact: true })).toBeEnabled();
  await page.keyboard.press('6');
  await expect(page.locator('#scores tr').first().locator('td').first()).toHaveText('6');
  const legal = page.locator('#hand button:not(:disabled)').first();
  const shortcut = await legal.locator('.key-hint').textContent();
  const before = await page.locator('#hand button').count();
  await page.keyboard.press(shortcut);
  await expect(page.locator('#hand button')).toHaveCount(before - 1);
  await page.getByRole('button', { name: 'New game', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Take a seat' })).toBeVisible();
  await expect(page.locator('#hand button')).toHaveCount(0);
  await page.keyboard.press('9');
  await expect(page.locator('#hand button')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('a nine-card hand fits on a narrow phone and controls remain usable', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  for (let i = 0; i < 240; i++) {
    if ((await page.locator('#deal-label').textContent()).startsWith('Deal 9 /') && await page.locator('#actions button[data-bid]').count()) break;
    await playAction(page);
  }
  await expect(page.locator('#hand button')).toHaveCount(9);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/mobile-nine-cards.png', fullPage: true });
  await playAction(page);
  await page.locator('#hand button:not(:disabled)').first().click();
  await expect(page.locator('#hand button')).toHaveCount(8);
  expect(errors).toEqual([]);
});
