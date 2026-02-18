import { TpsFileEditorTestIds } from '../../src/test-ids/TpsFileEditorTestIds.js'
import { TpsPaletteListTestIds } from '../../src/test-ids/TpsPaletteListTestIds.js'
import { TpsPaletteListItemTestIds } from '../../src/test-ids/TpsPaletteListItemTestIds.js'
import { TpsPaletteExportTestIds } from '../../src/test-ids/TpsPaletteExportTestIds.js'

export class TpsFileEditor {
  constructor(page) {
    this.page = page
  }

  get component() {
    return this.page.getByTestId(TpsFileEditorTestIds.Self)
  }

  get fileName() {
    return this.page.getByTestId(TpsFileEditorTestIds.FileName)
  }

  get paletteList() {
    return this.page.getByTestId(TpsPaletteListTestIds.Self)
  }

  get paletteCount() {
    return this.page.getByTestId(TpsPaletteListTestIds.Count)
  }

  async getPaletteItems() {
    return this.page.getByTestId(TpsPaletteListItemTestIds.Self).all()
  }

  async getPaletteCount() {
    return this.page.getByTestId(TpsPaletteListItemTestIds.Self).count()
  }

  async clickPalette(index) {
    const items = await this.getPaletteItems()
    if (!items[index]) {
      throw new Error(`Palette index ${index} out of bounds (${items.length} items)`)
    }
    await items[index].click()
  }

  async doubleClickPalette(index) {
    const items = await this.getPaletteItems()
    if (!items[index]) {
      throw new Error(`Palette index ${index} out of bounds (${items.length} items)`)
    }
    await items[index].dblclick()
  }

  async togglePaletteCheckbox(index) {
    const items = await this.getPaletteItems()
    if (!items[index]) {
      throw new Error(`Palette index ${index} out of bounds (${items.length} items)`)
    }
    await items[index].getByTestId(TpsPaletteListItemTestIds.Checkbox).click()
  }

  async clickClonePalette(index) {
    const items = await this.getPaletteItems()
    if (!items[index]) {
      throw new Error(`Palette index ${index} out of bounds (${items.length} items)`)
    }
    await items[index].getByTestId(TpsPaletteListItemTestIds.Clone).click()
  }

  // Action buttons
  get addPaletteButton() {
    return this.page.locator('button[title="Add palette (+)"]')
  }

  get deleteSelectedButton() {
    return this.page.locator('button[title="Delete selected palettes"]')
  }

  get selectAllButton() {
    return this.page.locator('button[title="Select all palettes"]')
  }

  get clearSelectionButton() {
    return this.page.locator('button[title="Clear palette selection"]')
  }

  get filterButton() {
    return this.page.locator('button[title="Filter palettes"]')
  }

  get exportButton() {
    return this.page.locator('button[title="Export selected palettes to new file"]')
  }

  get closeButton() {
    return this.page.locator('button[title="Close file"]')
  }

  get saveButton() {
    return this.page.locator('button[title="Save changes"]')
  }

  // Filter fields (using existing IDs)
  get filterNameInput() {
    return this.page.locator('#palettefilter-name')
  }

  get filterNoNameCheckbox() {
    return this.page.locator('#palettefilter-noname')
  }

  get filterSelectedCheckbox() {
    return this.page.locator('#palettefilter-selected')
  }

  get filterModifiedCheckbox() {
    return this.page.locator('#palettefilter-modified')
  }

  // Export panel
  get exportFileName() {
    return this.page.getByTestId(TpsPaletteExportTestIds.FileName)
  }

  get exportSaveButton() {
    return this.page.getByTestId(TpsPaletteExportTestIds.Button)
  }

  // Actions
  async clickAddPalette() {
    await this.addPaletteButton.click()
  }

  async clickSelectAll() {
    await this.selectAllButton.click()
  }

  async clickClearSelection() {
    await this.clearSelectionButton.click()
  }

  async clickFilter() {
    await this.filterButton.click()
  }

  async clickExport() {
    await this.exportButton.click()
  }

  async clickClose() {
    await this.closeButton.click()
  }

  async clickSave() {
    await this.saveButton.click()
  }
}
