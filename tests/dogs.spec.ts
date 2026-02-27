import { test, expect } from '@playwright/test';

test.describe('Dog page testing', () => {
  test('[POSITIVE] img element has attribute src which should strart with https', async ({ page }) => {
    await page.goto('/')

    await page.waitForResponse('**/api/dogs/random')

    const imgElement = page.getByAltText('Random dog')
    await expect(imgElement).toHaveAttribute('src', /^https/)
  });

  test('[POSITIVE] dog image is retrieved successfully, when button is clicked', async ({ page }) => {
    await page.goto('/')

    const responsePromise = page.waitForResponse('**/api/dogs/random')

    await page.getByRole('button', { name: 'Get another dog' }).click()

    await responsePromise

    const imgElement = page.getByAltText('Random dog')
    await expect(imgElement).toHaveAttribute('src', /^https/)
  });

  test('[NEGATIVE] should display error message when API call fails', async ({ page }) => {
    await page.route('**/api/dogs/random', async (route) => {
            await route.abort('failed')
      });

    await page.goto('/');

    const errorDivElement = page.locator('.error');
    const hintText = errorDivElement.locator('.hint');

    await expect(errorDivElement).toBeVisible()
    await expect(hintText).toBeVisible();
    
    await expect(errorDivElement).toContainText(/error/i)
  });
})

