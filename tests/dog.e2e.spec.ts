import { test, expect } from '@playwright/test'

test.describe('Dog App - E2E', () => {
  test('Test 3: on page load dog image is loaded (img src exists and starts with https)', async ({ page }) => {
    await page.goto('/')

    // Ждём, пока UI реально дождался API
    await page.waitForResponse('**/api/dogs/random')

    const img = page.locator('img')
    await expect(img).toHaveCount(1)

    const src = await img.getAttribute('src')
    expect(src).toBeTruthy()
    expect(src!.startsWith('https://')).toBe(true)
  })

  test('Test 4: clicking button loads a new dog image (src changes and starts with https)', async ({ page }) => {
    await page.goto('/')

    await page.waitForResponse('**/api/dogs/random')

    const img = page.locator('img')
    const oldSrc = await img.getAttribute('src')
    expect(oldSrc).toBeTruthy()

    const responsePromise = page.waitForResponse('**/api/dogs/random')

    // По скрину кнопка называется "GET ANOTHER DOG"
    await page.getByRole('button', { name: /get another dog/i }).click()

    await responsePromise

    const newSrc = await img.getAttribute('src')
    expect(newSrc).toBeTruthy()
    expect(newSrc!.startsWith('https://')).toBe(true)

    // Обычно URL меняется. Если вдруг API вернул тот же URL (редко), тест может флапать.
    // Поэтому делаем "желательно отличается", но строго не валим за это:
    expect(newSrc).not.toBeNull()
    if (oldSrc && newSrc) {
      expect(newSrc === oldSrc).toBe(false)
    }
  })

  test('Test 5: when API call fails, page shows visible error text', async ({ page }) => {
    // Ломаем именно запрос к нашему backend endpoint
    await page.route('**/api/dogs/random', async (route) => {
      await route.abort()
    })

    await page.goto('/')

    // В задании: "Page does now show any alerts... check implementation how errors are displayed."
    // Значит ищем элемент с error (regex) и проверяем, что видимый.
    const errorEl = page.getByText(/error/i)
    await expect(errorEl).toBeVisible()
  })
})