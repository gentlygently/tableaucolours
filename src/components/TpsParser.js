const xmlParser = new DOMParser()
const colourPattern = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i

function parse(xml) {
  if (!xml) {
    return invalidFile('')
  }
  return { isValid: true }
}

const invalidFile = message => ({
  isValid: false,
  validationMessage: message,
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

  return parsePaletteElement(root)
}

function parsePaletteElement(element) {
  if (element.tagName !== 'color-palette') {
    return invalidPalette('Expected a root element of <color-palette>')
  }

  const colours = [...element.children].filter(x => x.tagName === 'color').map(x => x.innerHTML.trim())

  if (!colours.length) {
    return invalidPalette('Expected one or more <color> elements')
  }

  if (colours.filter(x => !x).length > 0) {
    return invalidPalette('All <color> elements must contain a valid colour')
  }

  const invalidColour = colours.find(x => !colourPattern.test(x))

  if (invalidColour) {
    return invalidPalette(`'${invalidColour}' is not a valid colour`)
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

const invalidPalette = message => ({
  isValid: false,
  validationMessage: message,
  palette: {},
})

export { parse, parsePalette }
