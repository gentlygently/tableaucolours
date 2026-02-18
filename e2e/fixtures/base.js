import { test as base } from '@playwright/test'
import { ColourPaletteEditor } from '../pages/ColourPaletteEditor'
import { StartMenu } from '../pages/StartMenu'
import { TpsFileEditor } from '../pages/TpsFileEditor'

export const test = base.extend({
  startMenu: async ({ page }, use) => {
    const startMenu = new StartMenu(page)
    await startMenu.goto()
    await use(startMenu)
  },

  colourPaletteEditor: async ({ page }, use) => {
    const startMenu = new StartMenu(page)
    await startMenu.goto()
    await startMenu.clickCreateTemplate()
    const colourPaletteEditor = new ColourPaletteEditor(page)
    await use(colourPaletteEditor)
  },

  tpsFileEditor: async ({ page }, use) => {
    const startMenu = new StartMenu(page)
    await startMenu.goto()
    const tpsFileEditor = new TpsFileEditor(page)
    await use(tpsFileEditor)
  },
})

export { expect } from '@playwright/test'
