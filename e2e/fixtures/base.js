import { test as base } from '@playwright/test'
import { fileURLToPath } from 'url'
import { join } from 'path'
import { ColourPaletteEditor } from '../pages/ColourPaletteEditor'
import { StartMenu } from '../pages/StartMenu'
import { TpsFileEditor } from '../pages/TpsFileEditor'

const sampleTpsFilePath = join(
  fileURLToPath(import.meta.url),
  '..',
  'test-files',
  'all-valid.tps',
)

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
    await colourPaletteEditor.component.waitFor({ state: 'visible' })
    await use(colourPaletteEditor)
  },

  tpsFileEditor: async ({ page }, use) => {
    const startMenu = new StartMenu(page)
    await startMenu.goto()
    await startMenu.openTpsFile(sampleTpsFilePath)
    const tpsFileEditor = new TpsFileEditor(page)
    await tpsFileEditor.component.waitFor({ state: 'visible' })
    await use(tpsFileEditor)
  },
})

export { expect } from '@playwright/test'
