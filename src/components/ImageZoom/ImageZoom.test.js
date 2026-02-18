import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageZoom from './ImageZoom.vue'

describe('ImageZoom', () => {
  const defaultRange = { min: 0.1, max: 10 }

  function renderZoom(props = {}) {
    return mount(ImageZoom, {
      props: { scale: 1, range: defaultRange, enabled: true, ...props },
    })
  }

  it('displays the scale as a percentage', () => {
    const wrapper = renderZoom({ scale: 1.5 })

    expect(wrapper.find('.imagezoom-percentage').text()).toBe('150%')
  })

  it('emits zoom with increased scale when zoom in clicked', async () => {
    const wrapper = renderZoom({ scale: 1 })

    await wrapper.find('.imagezoom-in').trigger('click')

    expect(wrapper.emitted('zoom')).toHaveLength(1)
    expect(wrapper.emitted('zoom')[0][0]).toBeCloseTo(1.1)
  })

  it('emits zoom with decreased scale when zoom out clicked', async () => {
    const wrapper = renderZoom({ scale: 1 })

    await wrapper.find('.imagezoom-out').trigger('click')

    expect(wrapper.emitted('zoom')).toHaveLength(1)
    expect(wrapper.emitted('zoom')[0][0]).toBeCloseTo(0.9)
  })

  it('does not emit zoom when disabled', async () => {
    const wrapper = renderZoom({ enabled: false })

    await wrapper.find('.imagezoom-in').trigger('click')
    await wrapper.find('.imagezoom-out').trigger('click')

    expect(wrapper.emitted('zoom')).toBeUndefined()
  })

  it('disables buttons when not enabled', () => {
    const wrapper = renderZoom({ enabled: false })

    expect(wrapper.find('.imagezoom-in').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.imagezoom-out').attributes('disabled')).toBeDefined()
  })

  it('disables slider when not enabled', () => {
    const wrapper = renderZoom({ enabled: false })

    expect(wrapper.find('.imagezoom-slider').attributes('disabled')).toBeDefined()
  })
})
