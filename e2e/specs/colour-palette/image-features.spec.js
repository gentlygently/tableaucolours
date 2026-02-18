import { test, expect } from '../../fixtures/base'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

test.describe('Image File Operations', () => {
  const testImagePath = join(
    __dirname,
    '..',
    '..',
    'fixtures',
    'test-files',
    'sample.png',
  )

  test('should open file chooser when Open Image button is clicked', async ({
    colourPaletteEditor,
  }) => {
    const fileChooser = await colourPaletteEditor.clickOpenImageButton()
    expect(fileChooser).toBeTruthy()
  })

  test('should load an image file and display it', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.uploadImage(testImagePath)

    await expect(colourPaletteEditor.imageCanvas).toBeVisible()
    await expect(colourPaletteEditor.imageCanvasElement).toBeVisible()

    const width = await colourPaletteEditor.imageCanvasElement.evaluate(
      (canvas) => canvas.width,
    )
    const height = await colourPaletteEditor.imageCanvasElement.evaluate(
      (canvas) => canvas.height,
    )
    expect(width).toBeGreaterThan(0)
    expect(height).toBeGreaterThan(0)
  })

  test('should enable extract colours button when image is loaded', async ({
    colourPaletteEditor,
  }) => {
    await expect(colourPaletteEditor.extractButton).toBeDisabled()

    await colourPaletteEditor.uploadImage(testImagePath)

    await expect(colourPaletteEditor.extractButton).toBeEnabled()
  })
})

test.describe('Image Colour Extraction', () => {
  const testImagePath = join(
    __dirname,
    '..',
    '..',
    'fixtures',
    'test-files',
    'sample.png',
  )

  test('should open colour extraction modal', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.uploadImage(testImagePath)
    await colourPaletteEditor.extractButton.click()

    await expect(
      colourPaletteEditor.imageExtractorModal.component,
    ).toBeVisible()
  })

  test('should replace colours when extracting from image', async ({
    colourPaletteEditor,
  }) => {
    await test.step('setup initial colours', async () => {
      await colourPaletteEditor.clickAddColour()
      await colourPaletteEditor.clickAddColour()
      const initialCount = await colourPaletteEditor.getColourCount()
      expect(initialCount).toBe(3)
    })

    await test.step('extract colours with replace option', async () => {
      await colourPaletteEditor.uploadImage(testImagePath)
      await colourPaletteEditor.extractButton.click()
      await expect(
        colourPaletteEditor.imageExtractorModal.component,
      ).toBeVisible()

      await colourPaletteEditor.imageExtractorModal.setNumberOfColours(5)
      await colourPaletteEditor.imageExtractorModal.replaceRadio.check()
      await colourPaletteEditor.imageExtractorModal.clickExtract()

      await expect(
        colourPaletteEditor.imageExtractorModal.component,
      ).not.toBeVisible()
    })

    await test.step('verify extracted colours', async () => {
      const newCount = await colourPaletteEditor.getColourCount()
      expect(newCount).toBe(5)
    })
  })

  test('should add colours when extracting from image with add option', async ({
    colourPaletteEditor,
  }) => {
    await test.step('verify initial state', async () => {
      const initialCount = await colourPaletteEditor.getColourCount()
      expect(initialCount).toBe(1)
    })

    await test.step('extract colours with add option', async () => {
      await colourPaletteEditor.uploadImage(testImagePath)
      await colourPaletteEditor.extractButton.click()
      await expect(
        colourPaletteEditor.imageExtractorModal.component,
      ).toBeVisible()

      await colourPaletteEditor.imageExtractorModal.setNumberOfColours(5)
      await colourPaletteEditor.imageExtractorModal.addRadio.check({
        force: true,
      })
      await colourPaletteEditor.imageExtractorModal.clickExtract()

      await expect(
        colourPaletteEditor.imageExtractorModal.component,
      ).not.toBeVisible()
    })

    await test.step('verify extracted colours', async () => {
      const newCount = await colourPaletteEditor.getColourCount()
      expect(newCount).toBe(6)
    })
  })

  test('should close extraction modal with cancel', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.uploadImage(testImagePath)
    await colourPaletteEditor.extractButton.click()
    await expect(
      colourPaletteEditor.imageExtractorModal.component,
    ).toBeVisible()

    await colourPaletteEditor.imageExtractorModal.clickCancel()

    await expect(
      colourPaletteEditor.imageExtractorModal.component,
    ).not.toBeVisible()
  })
})

test.describe('Image Zoom', () => {
  const testImagePath = join(
    __dirname,
    '..',
    '..',
    'fixtures',
    'test-files',
    'sample.png',
  )

  test('should show zoom controls when image is loaded', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.uploadImage(testImagePath)
    await expect(colourPaletteEditor.imageZoomComponent).toBeVisible()
  })

  test('should have zoom slider', async ({ colourPaletteEditor }) => {
    await colourPaletteEditor.uploadImage(testImagePath)
    await expect(colourPaletteEditor.imageZoomSlider).toBeVisible()
  })

  test('should zoom in with zoom in button', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.uploadImage(testImagePath)
    const initialZoom = await colourPaletteEditor.getZoomPercentage()

    await colourPaletteEditor.imageZoomInButton.click()

    const newZoom = await colourPaletteEditor.getZoomPercentage()
    expect(newZoom).toBeGreaterThan(initialZoom)
  })

  test('should zoom out with zoom out button', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.uploadImage(testImagePath)
    const initialZoom = await colourPaletteEditor.getZoomPercentage()

    await colourPaletteEditor.imageZoomOutButton.click()

    const newZoom = await colourPaletteEditor.getZoomPercentage()
    expect(newZoom).toBeLessThan(initialZoom)
  })

  test('should zoom with slider', async ({ colourPaletteEditor }) => {
    await colourPaletteEditor.uploadImage(testImagePath)
    const initialZoom = await colourPaletteEditor.getZoomPercentage()

    await colourPaletteEditor.imageZoomSlider.fill('75')

    const newZoom = await colourPaletteEditor.getZoomPercentage()
    expect(newZoom).toBeGreaterThan(initialZoom)
  })

  test('should zoom with scroll wheel on canvas', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.uploadImage(testImagePath)
    const initialZoom = await colourPaletteEditor.getZoomPercentage()

    // Vue app requires Shift+Wheel for zoom (@wheel.shift modifier)
    await colourPaletteEditor.imageCanvasElement.hover()
    await colourPaletteEditor.imageCanvasElement.evaluate((el) => {
      el.parentElement.dispatchEvent(
        new WheelEvent('wheel', {
          deltaY: -100,
          shiftKey: true,
          bubbles: true,
        }),
      )
    })

    const newZoom = await colourPaletteEditor.getZoomPercentage()
    expect(newZoom).toBeGreaterThan(initialZoom)
  })
})

test.describe('Canvas Hints', () => {
  const testImagePath = join(
    __dirname,
    '..',
    '..',
    'fixtures',
    'test-files',
    'sample.png',
  )

  test('should show initial hint to open, paste or drop an image', async ({
    colourPaletteEditor,
  }) => {
    const hintText = await colourPaletteEditor.getHintText()
    expect(hintText).toContain('Open')
    expect(hintText).toContain('paste or drop an image')
  })

  test('should show hint to select colour after image loaded', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.uploadImage(testImagePath)
    await expect(colourPaletteEditor.imageCanvasElement).toBeVisible()

    await expect(colourPaletteEditor.imageCanvasHint).toContainText(
      'Select a colour in the palette to pick colours from the image',
    )
  })

  test('should hide hint when colour is selected and image is loaded', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.selectColour(0)
    await colourPaletteEditor.uploadImage(testImagePath)

    await expect(colourPaletteEditor.imageCanvasHint).not.toBeVisible()
  })
})

test.describe('Image Drag and Drop', () => {
  const testImagePath = join(
    __dirname,
    '..',
    '..',
    'fixtures',
    'test-files',
    'sample.png',
  )

  test('should show drop target overlay when dragging image over canvas', async ({
    colourPaletteEditor,
  }) => {
    await colourPaletteEditor.imageCanvas.evaluate((el) => {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(
        new File([''], 'test.png', { type: 'image/png' }),
      )
      el.dispatchEvent(
        new DragEvent('dragenter', { dataTransfer, bubbles: true }),
      )
    })

    await expect(colourPaletteEditor.imageDropTarget).toBeVisible()
  })

  test('should hide drop target overlay when drag leaves canvas', async ({
    colourPaletteEditor,
  }) => {
    await test.step(
      'trigger dragenter to show overlay',
      async () => {
        await colourPaletteEditor.imageCanvas.evaluate((el) => {
          const dataTransfer = new DataTransfer()
          dataTransfer.items.add(
            new File([''], 'test.png', { type: 'image/png' }),
          )
          el.dispatchEvent(
            new DragEvent('dragenter', { dataTransfer, bubbles: true }),
          )
        })

        await expect(colourPaletteEditor.imageDropTarget).toBeVisible()
      },
    )

    await test.step(
      'trigger dragleave on drop target to hide overlay',
      async () => {
        await colourPaletteEditor.imageDropTarget.evaluate((el) => {
          el.dispatchEvent(new DragEvent('dragleave', { bubbles: true }))
        })

        await expect(colourPaletteEditor.imageDropTarget).not.toBeVisible()
      },
    )
  })
})
