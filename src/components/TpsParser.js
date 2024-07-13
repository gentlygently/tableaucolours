const xmlParser = new DOMParser()
const colourPattern = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?(?:[0-9a-f]{5})?$/i

function parseFile(xml) {
  if (!xml) {
    return invalidFile('')
  }

  const doc = xmlParser.parseFromString(xml, 'application/xml')
  const root = doc.documentElement

  if (root.getElementsByTagName('parsererror').length) {
    return invalidFile('Unable to parse XML')
  }

  if (root.tagName !== 'workbook') {
    return invalidPalette('Expected a root element of <workbook>')
  }

  const preferences = [...root.children].find(x => x.tagName === 'preferences')

  if (!preferences) {
    return invalidPalette('Expected a <preferences> element inside <workbook>')
  }

  const parsedPalettes = [...preferences.children]
    .filter(x => x.tagName === 'color-palette')
    .map(x => parsePaletteElement(x))

  const paletteErrors = parsedPalettes
    .filter(x => !x.isValid)
    .map(x => ({ message: x.validationMessage, palette: x.palette.name }))

  if (paletteErrors.length) {
    return invalidFile(paletteErrors)
  }

  return {
    isValid: true,
    validationMessage: '',
    palettes: parsedPalettes.map(x => x.palette),
  }
}

const invalidFile = messages => ({
  isValid: false,
  validationMessages: typeof messages === 'string' ? [{ message: messages, palette: '' }] : messages,
  palettes: [],
})

function parsePalette(xml) {
  if (!xml) {
    return invalidPalette('')
  }

  const doc = xmlParser.parseFromString(xml, 'application/xml')
  const root = doc.documentElement

  if (root.getElementsByTagName('parsererror').length) {
    return invalidPalette('Unable to parse XML')
  }

  return parsePaletteElement(root, true)
}

function parsePaletteElement(element, requireColour) {
  if (element.tagName !== 'color-palette') {
    return invalidPalette('Expected a root element of <color-palette>')
  }

  const colours = [...element.children].filter(x => x.tagName === 'color').map(x => x.innerHTML.trim())

  if (requireColour && !colours.length) {
    return invalidPalette('Expected one or more <color> elements', element)
  }

  if (colours.filter(x => !x).length > 0) {
    return invalidPalette('All <color> elements must contain a valid colour', element)
  }

  const invalidColour = colours.find(x => !colourPattern.test(x))

  if (invalidColour) {
    return invalidPalette(`'${invalidColour}' is not a valid colour`, element)
  }

  return {
    isValid: true,
    validationMessage: '',
    palette: {
      name: element.getAttribute('name') ?? '',
      type: element.getAttribute('type') ?? '',
      colours: colours,
    },
  }
}

const invalidPalette = (message, element) => ({
  isValid: false,
  validationMessage: message,
  palette: {
    name: element.getAttribute('name') ?? '',
  },
})

export { parseFile, parsePalette }
