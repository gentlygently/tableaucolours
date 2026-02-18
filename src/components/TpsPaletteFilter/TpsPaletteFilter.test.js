import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestPinia } from '@/testing/test-utils'
import TpsPaletteFilter from './TpsPaletteFilter.vue'
import { useTpsFileStore } from '@/stores/tpsfile'

describe('TpsPaletteFilter', () => {
  let pinia, store

  beforeEach(() => {
    pinia = createTestPinia()
    store = useTpsFileStore()
  })

  function renderFilter() {
    return mount(TpsPaletteFilter, {
      global: { plugins: [pinia] },
    })
  }

  it('renders name filter input', () => {
    const wrapper = renderFilter()

    expect(wrapper.find('#palettefilter-name').exists()).toBe(true)
  })

  it('renders no-name checkbox', () => {
    const wrapper = renderFilter()

    expect(wrapper.find('#palettefilter-noname').exists()).toBe(true)
  })

  it('renders type checkboxes', () => {
    const wrapper = renderFilter()

    const labels = wrapper.findAll('.type .input label')
    expect(labels).toHaveLength(3)
    expect(labels[0].text()).toContain('Regular')
    expect(labels[1].text()).toContain('Sequential')
    expect(labels[2].text()).toContain('Diverging')
  })

  it('renders selected checkbox', () => {
    const wrapper = renderFilter()

    expect(wrapper.find('#palettefilter-selected').exists()).toBe(true)
  })

  it('renders modified checkbox', () => {
    const wrapper = renderFilter()

    expect(wrapper.find('#palettefilter-modified').exists()).toBe(true)
  })

  it('updates store name filter on input', async () => {
    const wrapper = renderFilter()

    await wrapper.find('#palettefilter-name').setValue('test')

    expect(store.paletteFilterValues.name).toBe('test')
  })

  it('updates store selected filter on checkbox', async () => {
    const wrapper = renderFilter()

    await wrapper.find('#palettefilter-selected').setValue(true)

    expect(store.paletteFilterValues.selected).toBe(true)
  })
})
