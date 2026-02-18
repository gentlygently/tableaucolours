import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestPinia, userEvent } from '@/testing/test-utils'
import ColourPaletteImport from './ColourPaletteImport.vue'
import { usePaletteStore } from '@/stores/palette'

describe('ColourPaletteImport', () => {
  let store, pinia

  function renderImport() {
    return mount(ColourPaletteImport, {
      global: { plugins: [pinia], stubs: { teleport: true } },
    })
  }

  beforeEach(() => {
    pinia = createTestPinia()
    store = usePaletteStore()
    store.open()
  })

  it('renders a textarea for pasting XML', () => {
    const wrapper = renderImport()

    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('has import button disabled when textarea is empty', () => {
    const wrapper = renderImport()

    expect(wrapper.find('.importcode-button--import').attributes('disabled')).toBeDefined()
  })

  it('enables import button when valid XML is entered', async () => {
    const wrapper = renderImport()
    const validXml =
      '<color-palette name="Test" type="regular"><color>#ffffff</color></color-palette>'

    await wrapper.find('textarea').setValue(validXml)

    expect(wrapper.find('.importcode-button--import').attributes('disabled')).toBeUndefined()
  })

  it('shows validation message for invalid XML', async () => {
    const wrapper = renderImport()

    await wrapper.find('textarea').setValue('<not-a-palette />')

    expect(wrapper.find('.importcode-validationmessage').text()).toContain(
      'Expected a root element of <color-palette>',
    )
  })

  it('applies invalid class for invalid XML', async () => {
    const wrapper = renderImport()

    await wrapper.find('textarea').setValue('<not-a-palette />')

    expect(wrapper.find('textarea').classes()).toContain('importcode-code--invalid')
  })

  it('imports palette and emits close on import click', async () => {
    const wrapper = renderImport()
    const validXml =
      '<color-palette name="Imported" type="ordered-sequential"><color>#ff0000</color></color-palette>'

    await wrapper.find('textarea').setValue(validXml)
    await userEvent.click(wrapper.find('.importcode-button--import').element)

    expect(store.name).toBe('Imported')
    expect(store.type).toBe('ordered-sequential')
    expect(store.colours[0].hex).toBe('#FF0000')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits close on cancel click', async () => {
    const wrapper = renderImport()

    await userEvent.click(wrapper.find('.importcode-button--cancel').element)

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
