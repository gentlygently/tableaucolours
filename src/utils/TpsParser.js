//import { PaletteTypes } from '../PaletteTypes'

const xmlParser = new DOMParser()
const colourPattern = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?(?:[0-9a-f]{5})?$/i

function parseTpsFile(xml) {
  if (!xml) {
    return invalidFile('')
  }

  const doc = xmlParser.parseFromString(xml, 'application/xml')
  const root = doc.documentElement

  if (doc.querySelector('parsererror')) {
    return invalidFile('Unable to parse XML')
  }

  if (root.tagName !== 'workbook') {
    return invalidFile(`Expected a root element of <workbook>, found <${root.tagName}>`)
  }

  const preferences = [...root.children].find(x => x.tagName === 'preferences')

  if (!preferences) {
    return invalidFile('Expected a <preferences> element inside <workbook>')
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
    xml: xml,
  }
}

const invalidFile = messages => ({
  isValid: false,
  validationMessages:
    typeof messages === 'string' ? [{ message: messages, palette: '' }] : messages,
  palettes: [],
})

function parseColourPalette(xml) {
  if (!xml) {
    return invalidPalette('')
  }

  const doc = xmlParser.parseFromString(xml, 'application/xml')
  const root = doc.documentElement

  if (doc.querySelector('parsererror')) {
    return invalidPalette('Unable to parse XML')
  }

  return parsePaletteElement(root, true)
}

function parsePaletteElement(element, requireColour) {
  if (element.tagName !== 'color-palette') {
    return invalidPalette('Expected a root element of <color-palette>')
  }

  const colours = [...element.children]
    .filter(x => x.tagName === 'color')
    .map(x => x.innerHTML.trim())

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

  const type = element.getAttribute('type') ?? ''
  /*
  if (!PaletteTypes.get(type)) {
    return invalidPalette(`'${type}' is not a valid palette type`, element)
  }
*/
  return {
    isValid: true,
    validationMessage: '',
    palette: {
      name: element.getAttribute('name') ?? '',
      type: type,
      colours: colours,
    },
  }
}

const invalidPalette = (message, element) => ({
  isValid: false,
  validationMessage: message,
  palette: {
    name: element ? element.getAttribute('name') ?? '' : '',
  },
})

export { parseTpsFile, parseColourPalette }
