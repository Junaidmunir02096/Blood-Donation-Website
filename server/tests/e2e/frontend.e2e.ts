import { test, expect } from '@playwright/test';

const donors = [
  {
    id: 'donor-1',
    name: 'Ayesha Khan',
    avatar: 'AK',
    bloodGroup: 'O+',
    city: 'Lahore',
    km: 3,
    lastDonated: '2 months ago',
    phone: '03001234567',
    status: 'verified',
  },
  {
    id: 'donor-2',
    name: 'Bilal Ahmed',
    avatar: 'BA',
    bloodGroup: 'A+',
    city: 'Karachi',
    km: 8,
    lastDonated: '1 year ago',
    phone: '03007654321',
    status: 'verified',
  },
];

test.beforeEach(async ({ page }) => {
  // Keep frontend tests deterministic and independent of MongoDB/the API server.
  await page.route('**/api/v1/**', async (route) => {
    const path = new URL(route.request().url()).pathname;

    if (path.endsWith('/auth/session')) {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { authenticated: false, user: null } }),
      });
      return;
    }

    if (path.endsWith('/donors')) {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: donors }),
      });
      return;
    }

    await route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ success: false, error: { message: 'Not mocked' } }),
    });
  });
});

test('loads the landing page and its primary actions', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Donate Blood, Save Lives/i })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Become a Donor' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Find Blood' })).toBeVisible();
});

test('shows client-side registration validation', async ({ page }) => {
  await page.goto('/auth?mode=register');

  await expect(page.getByRole('heading', { name: 'Create an Account' })).toBeVisible();
  await page.getByRole('button', { name: /Create Account/i }).click();

  await expect(page.getByText('Full name is required.')).toBeVisible();
  await expect(page.getByText('Enter a valid email address.')).toBeVisible();
  await expect(page.getByText('Password must be at least 8 characters.')).toBeVisible();
});

test('redirects unauthenticated users to login', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page).toHaveURL(/\/auth\?mode=login&redirect=%2Fdashboard$/);
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
});

test('displays and filters donor search results', async ({ page }) => {
  await page.goto('/search');

  await expect(page.getByRole('heading', { name: /Find a Donor/i })).toBeVisible();
  await expect(page.locator('.donor-card')).toHaveCount(2);

  await page.getByRole('button', { name: 'O+', exact: true }).click();
  await page.getByRole('button', { name: 'Exact type' }).click();

  await expect(page.locator('.donor-card')).toHaveCount(1);
  await expect(page.getByRole('article', { name: 'Donor: Ayesha Khan' })).toBeVisible();
});

test('changes donor result sorting', async ({ page }) => {
  await page.goto('/search');

  await page.getByRole('button', { name: /Sort by Distance/i }).click();
  await page.getByRole('option', { name: 'Most Recent' }).click();

  await expect(page.getByRole('button', { name: /Sort by Most Recent/i })).toBeVisible();
});
