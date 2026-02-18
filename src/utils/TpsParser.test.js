import { describe, expect, it, test } from 'vitest'
import { parseTpsFile, parseColourPalette } from './TpsParser'

describe('Parsing a TPS file', () => {
  it('returns invalid result if xml is empty', () => {
    const result = parseTpsFile('')

    expect(result.isValid).toBeFalsy()
  })

  it('returns invalid result when value is not valid XML', () => {
    const result = parseTpsFile(
      '<workbook><preferences><color-palette name="1" type="a"><color>#000</color></color-palette></preferences></workbook',
    )

    expect(result.isValid).toBeFalsy()
    expect(result.validationMessages[0].message).toBe('Unable to parse XML')
  })

  it('returns invalid result when root element is not <workbook>', () => {
    const result = parseTpsFile(
      '<workboook><preferences><color-palette name="1" type="a"><color>#000</color></color-palette></preferences></workboook>',
    )

    expect(result.isValid).toBeFalsy()
    expect(result.validationMessages[0].message).toBe(
      'Expected a root element of <workbook>, found <workboook>',
    )
  })

  it('returns invalid result when <workbook> does not contain <preferences>', () => {
    const result = parseTpsFile(
      '<workbook><prefs><color-palette name="1" type="a"><color>#000</color></color-palette></prefs></workbook>',
    )

    expect(result.isValid).toBeFalsy()
    expect(result.validationMessages[0].message).toBe(
      'Expected a <preferences> element inside <workbook>',
    )
  })

  it('returns invalid result when any palette is invalid', () => {
    const result = parseTpsFile(
      `<workbook>
        <preferences>
          <color-palette name="One" type="a">
            <color>#000</color>
          </color-palette>
          <color-palette name="Two" type="b">
            <color></color>
          </color-palette>
          <color-palette name="Three" type="c">
            <color>#000</color>
            <color>green</color>
          </color-palette>
          <color-palette name="Four" type="d">
            <color>#000</color>
          </color-palette>
        </preferences>
       </workbook>`,
    )

    expect(result.isValid).toBeFalsy()
    expect(result.validationMessages.length).toBe(2)
    expect(result.validationMessages[0]).toEqual({
      palette: 'Two',
      message: 'All <color> elements must contain a valid colour',
    })
    expect(result.validationMessages[1]).toEqual({
      palette: 'Three',
      message: "'green' is not a valid colour",
    })
  })

  it('returns parsed palettes', () => {
    const result = parseTpsFile(
      `<workbook>
        <preferences>
          <color-palette name="One" type="a">
            <color>#000</color>
          </color-palette>
          <color-palette name="Two" type="b">
            <color>#fff</color>
            <color>#012345</color>
          </color-palette>
        </preferences>
       </workbook>`,
    )

    expect(result.isValid).toBeTruthy()
    expect(result.palettes.length).toBe(2)
    expect(result.palettes[0].name).toBe('One')
    expect(result.palettes[0].type).toBe('a')
    expect(result.palettes[0].colours).toEqual(['#000'])
    expect(result.palettes[1].name).toBe('Two')
    expect(result.palettes[1].type).toBe('b')
    expect(result.palettes[1].colours).toEqual(['#fff', '#012345'])
  })

  it('parses palettes with no colours', () => {
    const result = parseTpsFile(
      `<workbook>
        <preferences>
          <color-palette name="One" type="a">
          </color-palette>
        </preferences>
       </workbook>`,
    )

    expect(result.isValid).toBeTruthy()
    expect(result.palettes.length).toBe(1)
    expect(result.palettes[0].colours).toEqual([])
  })

  it('preserves original XML on valid result', () => {
    const xml = '<workbook><preferences></preferences></workbook>'
    const result = parseTpsFile(xml)

    expect(result.isValid).toBeTruthy()
    expect(result.xml).toBe(xml)
  })
})

describe('Parsing a colour palette element', () => {
  it('returns invalid result if xml is empty', () => {
    const result = parseColourPalette('')

    expect(result.isValid).toBeFalsy()
  })

  it('returns invalid result when value is not valid XML', () => {
    const result = parseColourPalette(
      'color-palette name="X" type="regular"><color>#fff</color></color-palette>',
    )

    expect(result.isValid).toBeFalsy()
    expect(result.validationMessage).toBe('Unable to parse XML')
  })

  it('returns invalid result when root element is not <color-palette>', () => {
    const result = parseColourPalette(
      '<colour-palette name="X" type="regular"><color>#fff</color></colour-palette>',
    )

    expect(result.isValid).toBeFalsy()
    expect(result.validationMessage).toBe('Expected a root element of <color-palette>')
  })

  it('returns invalid result when no <color> elements found in palette', () => {
    const result = parseColourPalette(
      '<color-palette name="X" type="regular"><colour>#fff</colour></color-palette>',
    )

    expect(result.isValid).toBeFalsy()
    expect(result.validationMessage).toBe('Expected one or more <color> elements')
  })

  it('returns invalid result when any <color> element is empty', () => {
    const result = parseColourPalette(
      '<color-palette name="X" type="regular"><color>#fff</color><color></color><color>#000</color></color-palette>',
    )

    expect(result.isValid).toBeFalsy()
    expect(result.validationMessage).toBe('All <color> elements must contain a valid colour')
  })

  test.each([
    { colour: 'red', problem: 'not a hex value' },
    { colour: '#ff', problem: '2 char hex' },
    { colour: '#ffff', problem: '4 char hex' },
    { colour: '#fffff', problem: '5 char hex' },
    { colour: '#fffffff', problem: '7 char hex' },
    { colour: '#fffffffff', problem: '9 char hex' },
    { colour: '#ffffffffff', problem: '10 char hex' },
    { colour: '#00ffgg', problem: 'invalid hex' },
    { colour: 'ffffff', problem: 'no hash' },
  ])('returns invalid result when color is $problem', ({ colour, problem }) => {
    const result = parseColourPalette(
      `<color-palette name="${problem}" type="regular"><color>#ffffff</color><color>${colour}</color><color>#000</color></color-palette>`,
    )

    expect(result.isValid).toBeFalsy()
    expect(result.validationMessage).toBe(`'${colour}' is not a valid colour`)
  })

  it('returns valid palette', () => {
    const result = parseColourPalette(
      `<color-palette name="Fingertips and Mountaintops" type="postbox">
         <color> #fff</color>
         <color> #ff00bc </color>
         <color>#0011ccff </color>
         <color>#000000</color>
       </color-palette>`,
    )

    expect(result.isValid).toBeTruthy()
    expect(result.palette.name).toBe('Fingertips and Mountaintops')
    expect(result.palette.type).toBe('postbox')
    expect(result.palette.colours).toEqual(['#fff', '#ff00bc', '#0011ccff', '#000000'])
  })
})
