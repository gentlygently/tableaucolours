import he from 'he'

const xmlParser = new DOMParser()
const xmlSerializer = new XMLSerializer()

function replacePalettesInTpsXml(xml, palettes) {
  const doc = xmlParser.parseFromString(xml, 'application/xml')
  const preferences = doc.getElementsByTagName('preferences')[0]
  const paletteElements = [...preferences.getElementsByTagName('color-palette')]

  paletteElements.forEach(e => e.remove())

  const paletteXml = palettes.map(x => colourPaletteXml(x.name, x.type, x.colours)).join('\n')

  preferences.innerHTML = preferences.innerHTML.trim() + '\n' + paletteXml + '\n'

  return xmlSerializer.serializeToString(doc)
}

function colourPaletteXml(name, type, colours) {
  let x = `<color-palette name="${he.encode(name, {
    useNamedReferences: true,
  })}" type="${type}">\n`

  colours.forEach(c => (x += `    <color>${typeof c === 'string' ? c : c.hex}</color>\n`))

  return x + '</color-palette>'
}

export { replacePalettesInTpsXml, colourPaletteXml }
