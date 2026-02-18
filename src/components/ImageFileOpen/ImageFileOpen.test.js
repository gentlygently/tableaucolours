import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageFileOpen from './ImageFileOpen.vue'

describe('ImageFileOpen', () => {
  it('renders the open button', () => {
    const wrapper = mount(ImageFileOpen)

    expect(wrapper.find('.imagefileopen--button').exists()).toBe(true)
  })

  it('renders a file input for images', () => {
    const wrapper = mount(ImageFileOpen)

    const input = wrapper.find('input[type="file"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('accept')).toBe('image/*')
  })

  it('emits file-selected when file input changes', async () => {
    const wrapper = mount(ImageFileOpen)
    const input = wrapper.find('input[type="file"]')

    await input.trigger('input')

    expect(wrapper.emitted('file-selected')).toHaveLength(1)
  })

  it('has title tooltip on button', () => {
    const wrapper = mount(ImageFileOpen)

    expect(wrapper.find('.imagefileopen--button').attributes('title')).toBe('Open image...')
  })
})
