<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// --- Colour conversion utilities ---

function hsvToRgb(h, s, v) {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  let r, g, b
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

function rgbToHsv(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = 60 * (((g - b) / d) % 6)
    else if (max === g) h = 60 * ((b - r) / d + 2)
    else h = 60 * ((r - g) / d + 4)
  }
  if (h < 0) h += 360
  const s = max === 0 ? 0 : d / max
  return { h, s, v: max }
}

function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
      .toUpperCase()
  )
}

function hexToRgb(hex) {
  const cleaned = hex.replace('#', '')
  if (cleaned.length !== 6) return null
  const val = parseInt(cleaned, 16)
  if (isNaN(val)) return null
  return {
    r: (val >> 16) & 255,
    g: (val >> 8) & 255,
    b: val & 255,
  }
}

// --- Component ---

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const hue = ref(0)
const saturation = ref(0)
const value = ref(1)

const hexInput = ref('')
const rInput = ref('255')
const gInput = ref('255')
const bInput = ref('255')

const currentRgb = computed(() => hsvToRgb(hue.value, saturation.value, value.value))
const currentHex = computed(() =>
  rgbToHex(currentRgb.value.r, currentRgb.value.g, currentRgb.value.b)
)

function setFromHex(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
  hue.value = hsv.h
  saturation.value = hsv.s
  value.value = hsv.v
  syncInputs()
}

function syncInputs() {
  const rgb = currentRgb.value
  hexInput.value = currentHex.value.replace('#', '')
  rInput.value = String(rgb.r)
  gInput.value = String(rgb.g)
  bInput.value = String(rgb.b)
}

function emitUpdate() {
  emit('update:modelValue', { hex: currentHex.value })
}

// Initialise from prop
onMounted(() => {
  if (props.modelValue?.hex) {
    setFromHex(props.modelValue.hex)
  }
})

// Watch for external prop changes
watch(
  () => props.modelValue?.hex,
  newHex => {
    if (newHex && newHex.toUpperCase() !== currentHex.value) {
      setFromHex(newHex)
    }
  }
)

// --- Saturation panel drag ---

function updateSaturationFromPointer(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
  const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))
  saturation.value = x / rect.width
  value.value = 1 - y / rect.height
  syncInputs()
  emitUpdate()
}

function onSaturationPointerDown(e) {
  e.currentTarget.setPointerCapture(e.pointerId)
  updateSaturationFromPointer(e)
}

function onSaturationPointerMove(e) {
  if (e.currentTarget.hasPointerCapture(e.pointerId)) {
    updateSaturationFromPointer(e)
  }
}

// --- Hue slider ---

function onHueInput(e) {
  hue.value = Number(e.target.value)
  syncInputs()
  emitUpdate()
}

// --- Input handlers ---

function onHexInput(e) {
  const val = e.target.value.replace('#', '')
  hexInput.value = val
  if (val.length === 6) {
    const rgb = hexToRgb(val)
    if (rgb) {
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
      hue.value = hsv.h
      saturation.value = hsv.s
      value.value = hsv.v
      rInput.value = String(rgb.r)
      gInput.value = String(rgb.g)
      bInput.value = String(rgb.b)
      emitUpdate()
    }
  }
}

function onRgbInput(channel, e) {
  const raw = e.target.value
  if (raw === '') return
  let val = parseInt(raw, 10)
  if (isNaN(val)) return
  val = Math.max(0, Math.min(255, val))
  const r = channel === 'r' ? val : parseInt(rInput.value, 10) || 0
  const g = channel === 'g' ? val : parseInt(gInput.value, 10) || 0
  const b = channel === 'b' ? val : parseInt(bInput.value, 10) || 0
  const hsv = rgbToHsv(r, g, b)
  hue.value = hsv.h
  saturation.value = hsv.s
  value.value = hsv.v
  hexInput.value = rgbToHex(r, g, b).replace('#', '')
  if (channel === 'r') rInput.value = String(val)
  else if (channel === 'g') gInput.value = String(val)
  else bInput.value = String(val)
  emitUpdate()
}

const saturationPanelBg = computed(() => `hsl(${hue.value}, 100%, 50%)`)
const pointerLeft = computed(() => `${saturation.value * 100}%`)
const pointerTop = computed(() => `${(1 - value.value) * 100}%`)
</script>

<template>
  <div class="sketch-picker">
    <div
      class="sketch-picker-saturation"
      :style="{ backgroundColor: saturationPanelBg }"
      @pointerdown.prevent="onSaturationPointerDown"
      @pointermove="onSaturationPointerMove"
    >
      <div class="sketch-picker-saturation-white"></div>
      <div class="sketch-picker-saturation-black"></div>
      <div
        class="sketch-picker-saturation-pointer"
        :style="{ left: pointerLeft, top: pointerTop }"
      ></div>
    </div>

    <div class="sketch-picker-sliders">
      <input
        class="sketch-picker-hue"
        type="range"
        min="0"
        max="360"
        :value="Math.round(hue)"
        @input="onHueInput"
      />
    </div>

    <div class="sketch-picker-fields">
      <div class="sketch-picker-field sketch-picker-field--hex">
        <input type="text" :value="hexInput" maxlength="6" @input="onHexInput" />
        <label>Hex</label>
      </div>
      <div class="sketch-picker-field">
        <input type="number" min="0" max="255" :value="rInput" @input="onRgbInput('r', $event)" />
        <label>R</label>
      </div>
      <div class="sketch-picker-field">
        <input type="number" min="0" max="255" :value="gInput" @input="onRgbInput('g', $event)" />
        <label>G</label>
      </div>
      <div class="sketch-picker-field">
        <input type="number" min="0" max="255" :value="bInput" @input="onRgbInput('b', $event)" />
        <label>B</label>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '../../variables.less';

.sketch-picker {
  width: 100%;
  box-sizing: border-box;

  &-saturation {
    position: relative;
    width: 100%;
    padding-bottom: 73%;
    cursor: crosshair;
    overflow: hidden;
    touch-action: none;

    &-white,
    &-black {
      position: absolute;
      inset: 0;
    }

    &-white {
      background: linear-gradient(to right, #fff, transparent);
    }

    &-black {
      background: linear-gradient(to bottom, transparent, #000);
    }

    &-pointer {
      position: absolute;
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 50%;
      border: 0.15rem solid #fff;
      box-shadow: 0 0 0.2rem rgba(0, 0, 0, 0.6);
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
  }

  &-sliders {
    padding: 0.5rem 1rem;
  }

  .hueTrack {
    width: 100%;
    height: 0.6rem;
    cursor: pointer;
    background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
    border-radius: 0.2rem;
    border: none;
  }

  .hueThumb {
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 50%;
    border: solid 0.1rem @border-colour;
    box-shadow: none;
    background: #fff;
    cursor: pointer;
  }

  &-hue {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    margin: 0.3rem 0 0;
    outline: none;

    &::-webkit-slider-runnable-track {
      .hueTrack;
    }

    &::-moz-range-track {
      .hueTrack;
    }

    &::-webkit-slider-thumb {
      .hueThumb;
      -webkit-appearance: none;
      margin-top: -0.25rem;
    }

    &::-moz-range-thumb {
      .hueThumb;
    }
  }

  &-fields {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
  }

  &-field {
    flex: 1;
    display: flex;
    flex-direction: column;

    &--hex {
      flex: 2;
    }

    input {
      padding: 0.4rem;
      border: @border;
      border-radius: 0.2rem;
      font-size: 1rem;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      appearance: textfield;
      -moz-appearance: textfield;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }

    label {
      color: @tool-colour;
      padding: 0.3rem 0 0 0;
      font-size: 1.1rem;
      text-align: center;
    }
  }
}
</style>
