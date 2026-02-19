import { ColourPaletteImportTestIds } from '../../src/components/ColourPaletteImport/ColourPaletteImportTestIds.js'

export class ImportModal {
  constructor(page) {
    this.page = page
  }

  get component() {
    return this.page.getByTestId(ColourPaletteImportTestIds.Self)
  }

  get codeTextarea() {
    return this.page.getByTestId(ColourPaletteImportTestIds.Code)
  }

  get validationMessage() {
    return this.page.getByTestId(ColourPaletteImportTestIds.ValidationMessage)
  }

  get importButton() {
    return this.component.locator('button.importcode-button--import')
  }

  get cancelButton() {
    return this.component.locator('button.importcode-button--cancel')
  }

  async setCode(xml) {
    await this.codeTextarea.fill(xml)
  }

  async clickImport() {
    await this.importButton.click()
  }

  async clickCancel() {
    await this.cancelButton.click()
  }
}
