import { ColourPaletteGetCodeTestIds } from '../../src/test-ids/ColourPaletteGetCodeTestIds.js'

export class ExportModal {
  constructor(page) {
    this.page = page
  }

  get component() {
    return this.page.getByTestId(ColourPaletteGetCodeTestIds.Self)
  }

  get codeBlock() {
    return this.page.getByTestId(ColourPaletteGetCodeTestIds.Code)
  }

  get copyButton() {
    return this.page.getByTestId(ColourPaletteGetCodeTestIds.Button)
  }

  async getCode() {
    return this.codeBlock.textContent()
  }

  async clickCopy() {
    await this.copyButton.click()
  }
}
