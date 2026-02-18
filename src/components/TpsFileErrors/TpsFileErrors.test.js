import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TpsFileErrors from './TpsFileErrors.vue'

describe('TpsFileErrors', () => {
  it('renders file name', () => {
    const wrapper = mount(TpsFileErrors, {
      props: {
        fileName: 'test.tps',
        errors: [{ message: 'Bad XML', palette: '' }],
      },
    })

    expect(wrapper.text()).toContain('test.tps')
  })

  it('renders error messages as list items', () => {
    const wrapper = mount(TpsFileErrors, {
      props: {
        fileName: 'test.tps',
        errors: [
          { message: 'Error one', palette: '' },
          { message: 'Error two', palette: '' },
        ],
      },
    })

    const items = wrapper.findAll('li')
    expect(items).toHaveLength(2)
    expect(items[0].text()).toContain('Error one')
    expect(items[1].text()).toContain('Error two')
  })

  it('shows palette name prefix when error has a palette', () => {
    const wrapper = mount(TpsFileErrors, {
      props: {
        fileName: 'test.tps',
        errors: [{ message: 'Invalid colour', palette: 'My Palette' }],
      },
    })

    expect(wrapper.text()).toContain('In palette "My Palette":')
    expect(wrapper.text()).toContain('Invalid colour')
  })

  it('does not show palette prefix when palette is empty', () => {
    const wrapper = mount(TpsFileErrors, {
      props: {
        fileName: 'test.tps',
        errors: [{ message: 'Bad XML', palette: '' }],
      },
    })

    expect(wrapper.text()).not.toContain('In palette')
  })

  it('emits close when OK clicked', async () => {
    const wrapper = mount(TpsFileErrors, {
      props: {
        fileName: 'test.tps',
        errors: [{ message: 'Error', palette: '' }],
      },
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
