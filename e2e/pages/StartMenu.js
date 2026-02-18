import { StartMenuTestIds } from '../../src/test-ids/StartMenuTestIds.js'

export class StartMenu {
  constructor(page) {
    this.page = page
  }

  async goto() {
    await this.page.goto('/')
  }

  get component() {
    return this.page.getByTestId(StartMenuTestIds.Self)
  }

  get openFileButton() {
    return this.page.getByTestId(StartMenuTestIds.OpenFile)
  }

  get createTemplateButton() {
    return this.page.getByTestId(StartMenuTestIds.CreateTemplate)
  }

  async clickCreateTemplate() {
    await this.createTemplateButton.click()
  }

  async openTpsFile(filePath) {
    const fileChooserPromise = this.page.waitForEvent('filechooser')
    await this.openFileButton.click()
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles(filePath)
  }
}
