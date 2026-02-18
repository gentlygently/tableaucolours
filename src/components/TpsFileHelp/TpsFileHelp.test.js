import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TpsFileHelp from './TpsFileHelp.vue'

describe('TpsFileHelp', () => {
  it('renders without errors', () => {
    const wrapper = mount(TpsFileHelp)

    expect(wrapper.find('article').exists()).toBe(true)
  })

  it('contains expected heading', () => {
    const wrapper = mount(TpsFileHelp)

    expect(wrapper.find('h1').text()).toBe('Editing a .tps file')
  })
})
