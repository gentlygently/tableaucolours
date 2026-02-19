import { test, expect } from '../fixtures/base.js'

test.describe('Smoke Tests', () => {
  test('should load the application', async ({ page, startMenu }) => {
    await expect(page).toHaveTitle('Gently, gently | Tableau colour palette editor')
    await expect(page.locator('body')).toBeVisible()
    await expect(startMenu.component).toBeVisible()
  })

  test('should display start menu with two options', async ({ startMenu }) => {
    await expect(startMenu.openFileButton).toBeVisible()
    await expect(startMenu.createTemplateButton).toBeVisible()
  })

  test('should display the application header', async ({ page, startMenu }) => {
    await expect(page.locator('h1')).toHaveText('Gently, gently')
  })
})
