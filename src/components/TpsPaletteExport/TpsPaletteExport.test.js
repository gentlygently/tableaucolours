import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestPinia } from '@/testing/test-utils'
import TpsPaletteExport from './TpsPaletteExport.vue'
import { useTpsFileStore } from '@/stores/tpsfile'

describe('TpsPaletteExport', () => {
  let pinia, store

  beforeEach(() => {
    pinia = createTestPinia()
    store = useTpsFileStore()
    store.open('test.tps', '<xml/>', [
      { name: 'Red', type: 'regular', colours: ['#FF0000'] },
    ])
  })

  function renderExport() {
    return mount(TpsPaletteExport, {
      global: { plugins: [pinia] },
    })
  }

  it('renders filename input', () => {
    const wrapper = renderExport()

    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('renders export button', () => {
    const wrapper = renderExport()

    expect(wrapper.find('button').text()).toBe('Export')
  })

  it('disables export when no filename', () => {
    store.palettes[0].isSelected = true
    const wrapper = renderExport()

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('disables export when no palettes selected', async () => {
    const wrapper = renderExport()

    await wrapper.find('input').setValue('output.tps')

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('enables export when filename and palettes selected', async () => {
    store.palettes[0].isSelected = true
    const wrapper = renderExport()

    await wrapper.find('input').setValue('output.tps')

    expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
  })

  it('emits export with filename on click', async () => {
    store.palettes[0].isSelected = true
    const wrapper = renderExport()

    await wrapper.find('input').setValue('output')
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('export')).toHaveLength(1)
    expect(wrapper.emitted('export')[0][0]).toBe('output.tps')
  })

  it('does not append .tps if already present', async () => {
    store.palettes[0].isSelected = true
    const wrapper = renderExport()

    await wrapper.find('input').setValue('output.tps')
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('export')[0][0]).toBe('output.tps')
  })
})
