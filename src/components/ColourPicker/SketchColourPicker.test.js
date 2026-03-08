import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SketchColourPicker from './SketchColourPicker.vue'

describe('SketchColourPicker', () => {
  function renderPicker(hex = '#FF0000') {
    return mount(SketchColourPicker, {
      props: { modelValue: { hex } },
    })
  }

  function getHexInput(wrapper) {
    return wrapper.find('.sketch-picker-field--hex input')
  }

  function getRgbInputs(wrapper) {
    const fields = wrapper.findAll('.sketch-picker-field:not(.sketch-picker-field--hex) input')
    return { r: fields[0], g: fields[1], b: fields[2] }
  }

  describe('initialisation', () => {
    it('initialises hex input from modelValue', async () => {
      const wrapper = renderPicker('#3366CC')
      await nextTick()

      expect(getHexInput(wrapper).element.value).toBe('3366CC')
    })

    it('initialises RGB inputs from modelValue', async () => {
      const wrapper = renderPicker('#3366CC')
      await nextTick()
      const { r, g, b } = getRgbInputs(wrapper)

      expect(r.element.value).toBe('51')
      expect(g.element.value).toBe('102')
      expect(b.element.value).toBe('204')
    })

    it('handles black', async () => {
      const wrapper = renderPicker('#000000')
      await nextTick()
      const { r, g, b } = getRgbInputs(wrapper)

      expect(getHexInput(wrapper).element.value).toBe('000000')
      expect(r.element.value).toBe('0')
      expect(g.element.value).toBe('0')
      expect(b.element.value).toBe('0')
    })

    it('handles white', async () => {
      const wrapper = renderPicker('#FFFFFF')
      await nextTick()
      const { r, g, b } = getRgbInputs(wrapper)

      expect(getHexInput(wrapper).element.value).toBe('FFFFFF')
      expect(r.element.value).toBe('255')
      expect(g.element.value).toBe('255')
      expect(b.element.value).toBe('255')
    })
  })

  describe('hex input', () => {
    it('emits update:modelValue when valid hex is entered', async () => {
      const wrapper = renderPicker('#FF0000')

      await getHexInput(wrapper).setValue('00FF00')

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeTruthy()
      expect(emitted[emitted.length - 1][0]).toEqual({ hex: '#00FF00' })
    })

    it('updates RGB inputs when hex is changed', async () => {
      const wrapper = renderPicker('#FF0000')

      await getHexInput(wrapper).setValue('3366CC')

      const { r, g, b } = getRgbInputs(wrapper)
      expect(r.element.value).toBe('51')
      expect(g.element.value).toBe('102')
      expect(b.element.value).toBe('204')
    })

    it('does not emit for incomplete hex input', async () => {
      const wrapper = renderPicker('#FF0000')

      await getHexInput(wrapper).setValue('00F')

      // Only the initial mount emission (if any) should be present,
      // no new emission for incomplete hex
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeUndefined()
    })

    it('does not emit for invalid hex input', async () => {
      const wrapper = renderPicker('#FF0000')

      await getHexInput(wrapper).setValue('ZZZZZZ')

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeUndefined()
    })
  })

  describe('RGB inputs', () => {
    it('emits update:modelValue when R input changes', async () => {
      const wrapper = renderPicker('#000000')
      const { r } = getRgbInputs(wrapper)

      await r.setValue('128')

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeTruthy()
      expect(emitted[emitted.length - 1][0]).toEqual({ hex: '#800000' })
    })

    it('emits update:modelValue when G input changes', async () => {
      const wrapper = renderPicker('#000000')
      const { g } = getRgbInputs(wrapper)

      await g.setValue('128')

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeTruthy()
      expect(emitted[emitted.length - 1][0]).toEqual({ hex: '#008000' })
    })

    it('emits update:modelValue when B input changes', async () => {
      const wrapper = renderPicker('#000000')
      const { b } = getRgbInputs(wrapper)

      await b.setValue('128')

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeTruthy()
      expect(emitted[emitted.length - 1][0]).toEqual({ hex: '#000080' })
    })

    it('updates hex input when RGB changes', async () => {
      const wrapper = renderPicker('#000000')
      const { r } = getRgbInputs(wrapper)

      await r.setValue('255')

      expect(getHexInput(wrapper).element.value).toBe('FF0000')
    })

    it('clamps values above 255', async () => {
      const wrapper = renderPicker('#000000')
      const { r } = getRgbInputs(wrapper)

      await r.setValue('300')

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted[emitted.length - 1][0]).toEqual({ hex: '#FF0000' })
    })

    it('does not emit for empty input', async () => {
      const wrapper = renderPicker('#FF0000')
      const { r } = getRgbInputs(wrapper)

      await r.setValue('')

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeUndefined()
    })
  })

  describe('external prop changes', () => {
    it('updates inputs when modelValue prop changes', async () => {
      const wrapper = renderPicker('#FF0000')

      await wrapper.setProps({ modelValue: { hex: '#00FF00' } })
      await nextTick()

      expect(getHexInput(wrapper).element.value).toBe('00FF00')
      const { r, g, b } = getRgbInputs(wrapper)
      expect(r.element.value).toBe('0')
      expect(g.element.value).toBe('255')
      expect(b.element.value).toBe('0')
    })

    it('ignores prop change when hex matches current value', async () => {
      const wrapper = renderPicker('#FF0000')

      await wrapper.setProps({ modelValue: { hex: '#FF0000' } })
      await nextTick()

      // Should not have emitted anything
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('colour conversion round-trips', () => {
    it.each([
      ['#FF0000', 'red'],
      ['#00FF00', 'green'],
      ['#0000FF', 'blue'],
      ['#FFFFFF', 'white'],
      ['#000000', 'black'],
      ['#FF8000', 'orange'],
      ['#800080', 'purple'],
      ['#FFFF00', 'yellow'],
      ['#00FFFF', 'cyan'],
      ['#FF00FF', 'magenta'],
    ])('round-trips %s (%s) through hex input', async hex => {
      const wrapper = renderPicker('#000000')
      const hexStr = hex.replace('#', '')

      await getHexInput(wrapper).setValue(hexStr)

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted[emitted.length - 1][0]).toEqual({ hex })
    })
  })

  describe('rendering', () => {
    it('renders the saturation panel', () => {
      const wrapper = renderPicker()

      expect(wrapper.find('.sketch-picker-saturation').exists()).toBe(true)
    })

    it('renders the hue slider', () => {
      const wrapper = renderPicker()

      expect(wrapper.find('.sketch-picker-hue').exists()).toBe(true)
    })

    it('renders four field inputs (hex + RGB)', () => {
      const wrapper = renderPicker()
      const inputs = wrapper.findAll('.sketch-picker-fields input')

      expect(inputs).toHaveLength(4)
    })

    it('renders hex input as first field input', async () => {
      const wrapper = renderPicker('#FF0000')
      await nextTick()
      const firstInput = wrapper.findAll('.sketch-picker-fields input')[0]

      expect(firstInput.element.value).toBe('FF0000')
      expect(firstInput.attributes('type')).toBe('text')
    })

    it('renders RGB inputs as number type', () => {
      const wrapper = renderPicker()
      const inputs = wrapper.findAll('.sketch-picker-fields input')

      expect(inputs[1].attributes('type')).toBe('number')
      expect(inputs[2].attributes('type')).toBe('number')
      expect(inputs[3].attributes('type')).toBe('number')
    })

    it('renders hue slider as range input', () => {
      const wrapper = renderPicker()
      const hueInput = wrapper.find('.sketch-picker-hue')

      expect(hueInput.attributes('type')).toBe('range')
      expect(hueInput.attributes('min')).toBe('0')
      expect(hueInput.attributes('max')).toBe('360')
    })

    it('renders labels for all inputs', () => {
      const wrapper = renderPicker()
      const labels = wrapper.findAll('.sketch-picker-field label')

      expect(labels.map(l => l.text())).toEqual(['Hex', 'R', 'G', 'B'])
    })

    it('sets saturation panel background colour based on hue', () => {
      const wrapper = renderPicker('#FF0000')
      const panel = wrapper.find('.sketch-picker-saturation')

      expect(panel.attributes('style')).toContain('background-color')
    })
  })
})
