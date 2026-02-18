import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PalettePreview from './PalettePreview.vue'

describe('PalettePreview', () => {
  function renderPreview(type, colours) {
    return mount(PalettePreview, { props: { type, colours } })
  }

  it('renders a regular palette with equal-width colour stops', () => {
    const wrapper = renderPreview('regular', ['#ff0000', '#00ff00', '#0000ff'])
    const bg = wrapper.find('.palettepreview').attributes('style')

    expect(bg).toContain('linear-gradient')
    expect(bg).toContain('rgb(255, 0, 0)')
    expect(bg).toContain('rgb(0, 255, 0)')
    expect(bg).toContain('rgb(0, 0, 255)')
  })

  it('renders a sequential palette as a smooth gradient', () => {
    const wrapper = renderPreview('ordered-sequential', ['#fff', '#000'])
    const bg = wrapper.find('.palettepreview').attributes('style')

    expect(bg).toContain('linear-gradient')
    expect(bg).toContain('rgb(255, 255, 255)')
    expect(bg).toContain('rgb(0, 0, 0)')
    // sequential uses smooth gradient (no percentage stops between colours)
    expect(bg).not.toMatch(/rgb\(255, 255, 255\) \d+%/)
  })

  it('renders a diverging palette as a smooth gradient', () => {
    const wrapper = renderPreview('ordered-diverging', ['#fff', '#888', '#000'])
    const bg = wrapper.find('.palettepreview').attributes('style')

    expect(bg).toContain('linear-gradient')
    expect(bg).toContain('rgb(255, 255, 255)')
    expect(bg).toContain('rgb(136, 136, 136)')
    expect(bg).toContain('rgb(0, 0, 0)')
  })

  it('handles Colour objects with hex property', () => {
    const colours = [
      { hex: '#ff0000', id: 1, isSelected: false },
      { hex: '#00ff00', id: 2, isSelected: false },
    ]
    const wrapper = renderPreview('regular', colours)
    const bg = wrapper.find('.palettepreview').attributes('style')

    expect(bg).toContain('rgb(255, 0, 0)')
    expect(bg).toContain('rgb(0, 255, 0)')
  })

  it('renders no gradient for unknown type', () => {
    const wrapper = renderPreview('unknown-type', ['#fff'])
    const bg = wrapper.find('.palettepreview').attributes('style') || ''

    expect(bg).not.toContain('linear-gradient')
  })
})
