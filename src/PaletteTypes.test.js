import { describe, expect, it } from 'vitest'
import { PaletteTypes } from './PaletteTypes'

describe('PaletteTypes', () => {
  it('has a regular type', () => {
    expect(PaletteTypes.regular.id).toBe('regular')
    expect(PaletteTypes.regular.name).toBe('Regular')
  })

  it('has a sequential type', () => {
    expect(PaletteTypes.sequential.id).toBe('ordered-sequential')
    expect(PaletteTypes.sequential.name).toBe('Sequential')
  })

  it('has a diverging type', () => {
    expect(PaletteTypes.diverging.id).toBe('ordered-diverging')
    expect(PaletteTypes.diverging.name).toBe('Diverging')
  })

  it('finds a type by id', () => {
    expect(PaletteTypes.get('regular')).toBe(PaletteTypes.regular)
    expect(PaletteTypes.get('ordered-sequential')).toBe(PaletteTypes.sequential)
    expect(PaletteTypes.get('ordered-diverging')).toBe(PaletteTypes.diverging)
  })

  it('returns undefined for unknown type', () => {
    expect(PaletteTypes.get('unknown')).toBeUndefined()
  })
})
