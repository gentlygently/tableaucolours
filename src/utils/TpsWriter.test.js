import { describe, expect, it } from 'vitest'
import { colourPaletteXml, replacePalettesInTpsXml } from './TpsWriter'

describe('Generates TPS XML colour palette', () => {
  it('including name, type and colours', () => {
    const xml = colourPaletteXml('Midweek Mayhem', 'ordered-sequential', [
      '#ffffff',
      '#00ff00',
      '#000000',
    ])

    expect(xml).toBe(`<color-palette name="Midweek Mayhem" type="ordered-sequential">
    <color>#ffffff</color>
    <color>#00ff00</color>
    <color>#000000</color>
</color-palette>`)
  })

  it('encodes name in XML', () => {
    const xml = colourPaletteXml('<xml "name">', 'regular', ['#fff'])

    expect(xml).toBe(`<color-palette name="&lt;xml &quot;name&quot;&gt;" type="regular">
    <color>#fff</color>
</color-palette>`)
  })

  it('includes unknown string type', () => {
    const xml = colourPaletteXml('X', 'what?', ['#fff'])

    expect(xml).toBe(`<color-palette name="X" type="what?">
    <color>#fff</color>
</color-palette>`)
  })

  it('includes hex value of Colour instances', () => {
    const xml = colourPaletteXml('X', 'regular', [{ hex: '#aa00bb', id: 1, isSelected: false }])

    expect(xml).toBe(`<color-palette name="X" type="regular">
    <color>#aa00bb</color>
</color-palette>`)
  })
})

describe('Replaces colour palettes in TPS XML', () => {
  it('replaces existing colour palettes', () => {
    const palettes = [
      { name: 'Max', type: 'regular', colours: ['#f0f'] },
      {
        name: 'David',
        type: 'tools-out',
        colours: [{ hex: '#0f0', isSelected: false, id: 9 }],
      },
    ]
    const originalXml = `<?xml version='1.0'?>

<workbook>
\t<preferences>
\t\t<color-palette name="Pablo Honey" type="regular">
\t\t\t<color>#FFFFFF</color>
        </color-palette>
    </preferences>
</workbook>`

    const newXml = replacePalettesInTpsXml(originalXml, palettes)

    expect(newXml).toBe(`<workbook>
\t<preferences>
<color-palette name="Max" type="regular">
    <color>#f0f</color>
</color-palette>
<color-palette name="David" type="tools-out">
    <color>#0f0</color>
</color-palette>
</preferences>
</workbook>`)
  })

  it('does not replace other preferences', () => {
    const palettes = [{ name: 'Brakes', type: 'regular', colours: ['#f0f'] }]
    const originalXml = `<workbook>
\t<preferences>
        <brakes>Delta Brakes</brakes>
\t\t<color-palette name="Pablo Honey" type="regular">
\t\t\t<color>#FFFFFF</color>
        </color-palette>
    </preferences>
</workbook>`

    const newXml = replacePalettesInTpsXml(originalXml, palettes)

    expect(newXml).toBe(`<workbook>
\t<preferences><brakes>Delta Brakes</brakes>
<color-palette name="Brakes" type="regular">
    <color>#f0f</color>
</color-palette>
</preferences>
</workbook>`)
  })
})
