import { describe, expect, it, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { fireEvent } from '@testing-library/dom'
import { userEvent } from '@/testing/test-utils'
import ModalPanel from './ModalPanel.vue'

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn()
  HTMLDialogElement.prototype.close = vi.fn()
})

describe('ModalPanel', () => {
  function renderModal(props = {}, slots = {}) {
    return mount(ModalPanel, {
      props: { width: '30rem', show: false, ...props },
      slots,
      global: {
        stubs: {
          teleport: true,
        },
      },
    })
  }

  it('does not render dialog when show is false', () => {
    const wrapper = renderModal({ show: false })

    expect(wrapper.find('dialog').exists()).toBe(false)
  })

  it('renders dialog when show is true', () => {
    const wrapper = renderModal({ show: true })

    expect(wrapper.find('dialog').exists()).toBe(true)
  })

  it('calls showModal when show becomes true', async () => {
    const wrapper = renderModal({ show: false })

    await wrapper.setProps({ show: true })

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled()
  })

  it('renders slot content', () => {
    const wrapper = renderModal({ show: true }, { default: '<p>Hello</p>' })

    expect(wrapper.find('.modal-content').text()).toBe('Hello')
  })

  it('sets container width from prop', () => {
    const wrapper = renderModal({ show: true, width: '50rem' })

    expect(wrapper.find('.modal-container').attributes('style')).toContain('width: 50rem')
  })

  it('applies full class when full prop is true', () => {
    const wrapper = renderModal({ show: true, full: true })

    expect(wrapper.find('dialog').classes()).toContain('modal--full')
  })

  it('emits close when close button is clicked', async () => {
    const wrapper = renderModal({ show: true })

    await userEvent.click(wrapper.find('.modal-close').element)

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits close when clicking the dialog backdrop', async () => {
    const wrapper = renderModal({ show: true })

    fireEvent.mouseDown(wrapper.find('dialog').element)

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('does not emit close when clicking inside the container', async () => {
    const wrapper = renderModal({ show: true })

    fireEvent.mouseDown(wrapper.find('.modal-container').element)

    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('emits close on Escape key', async () => {
    const wrapper = renderModal({ show: true })

    await userEvent.keyboard('{Escape}')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
