<script setup>
import { computed, onMounted, ref } from 'vue'
import ColorThief from 'colorthief'
import { usePaletteStore } from '@/stores/palette'
import { useImageStore } from '@/stores/image'
import { converter, formatHex, useMode, modeLch, modeRgb, parse } from 'culori/fn'

const emit = defineEmits(['close'])

const imageStore = useImageStore()
const paletteStore = usePaletteStore()

const replaceExisting = ref(true)
const numberHasFocus = ref(false)
const numberInput = ref(null)
const numberOfColours = ref(8)

const canAddColours = computed(() => paletteStore.canAddColour)
const addColoursClass = computed(() => (canAddColours.value ? '' : 'extractcolours-field--disabled'))
const addColoursTitle = computed(() => (canAddColours.value ? '' : 'The colour palette is already full'))

const action = computed({
  get() {
    return !canAddColours.value || replaceExisting.value ? 'replaceColours' : 'addColours'
  },
  set(newValue) {
    replaceExisting.value = newValue === 'replaceColours'
  },
})

const maximumColoursToExtract = computed(() =>
  action.value === 'replaceColours'
    ? paletteStore.maximumColours
    : paletteStore.maximumColours - paletteStore.colours.length
)

const numberControlClass = computed(() => (numberHasFocus.value ? 'extractcolours-numbercontrol--focus' : ''))

const numberOfColoursToExtract = computed({
  get() {
    return numberOfColours.value > maximumColoursToExtract.value ? maximumColoursToExtract.value : numberOfColours.value
  },
  set(newValue) {
    if (newValue > maximumColoursToExtract.value) {
      newValue = maximumColoursToExtract.value
    } else if (newValue < 1) {
      newValue = 1
    }
    numberOfColours.value = newValue
  },
})

function close() {
  emit('close')
}

function extract() {
  const colours = new ColorThief()
    .getPalette(imageStore.image, numberOfColoursToExtract.value)
    .map(x => createColour(x[0], x[1], x[2]))
  colours.sort(compareColours)
  const hexes = colours.map(x => x.hex)
  switch (action.value) {
    case 'addColours':
      paletteStore.addColours(hexes)
      break
    case 'replaceColours':
      paletteStore.replaceColours(hexes)
      break
  }
  close()
}

useMode(modeLch)
useMode(modeRgb)
const lchConverter = converter('lch')

function createColour(r, g, b) {
  const rgb = parse(`rgb(${r} ${g} ${b})`)
  const lch = lchConverter(rgb)
  return {
    luminance: lch.l,
    chroma: lch.c,
    hue: lch.h,
    hex: formatHex(rgb).toUpperCase(),
  }
}

// Adapted from https://www.ckdsn.com/sorting-by-color-in-the-lch-color-space/
function compareColours(a, b) {
  // Sort greys to the end
  if (a.chroma < 4.1 && b.chroma >= 4.1) {
    return 1
  }
  if (b.chroma < 4.1 && a.chroma >= 4.1) {
    return -1
  }

  const aHue = Math.ceil(a.hue / 20) * 20
  const bHue = Math.ceil(b.hue / 20) * 20

  if (aHue !== bHue) {
    return aHue > bHue ? 1 : -1
  }

  const aLum = Math.round(a.luminance / 15) * 15
  const bLum = Math.round(b.luminance / 15) * 15

  if (aLum !== bLum) {
    return aLum > bLum ? -1 : 1
  }

  if (a.chroma === b.chroma) {
    return 0
  }

  return a.chroma > b.chroma ? 1 : -1
}

onMounted(() => numberInput.value.focus())
</script>

<template>
  <div class="extractcolours">
    <div class="extractcolours-fields">
      <div class="extractcolours-field extractcolours-number">
        <label for="numberOfColours" class="extractcolours-numberlabel">Number of colours to extract from image</label>
        <div class="extractcolours-numbercontrol" :class="numberControlClass">
          <button
            class="iconbutton extractcolours-numberstep extractcolours-numberstep--down fas fa-minus"
            :disabled="numberOfColoursToExtract <= 1"
            @click="numberOfColoursToExtract--"
          ></button>
          <input
            id="numberofcolours"
            ref="numberInput"
            v-model="numberOfColoursToExtract"
            type="number"
            min="1"
            :max="maximumColoursToExtract"
            class="extractcolours-numberinput"
            tabindex="100"
            @focus="numberHasFocus = true"
            @blur="numberHasFocus = false"
          />
          <button
            class="iconbutton extractcolours-numberstep extractcolours-numberstep--up fas fa-plus"
            :disabled="numberOfColoursToExtract >= maximumColoursToExtract"
            @click="numberOfColoursToExtract++"
          ></button>
        </div>
      </div>
      <div class="extractcolours-field extractcolours-action">
        <input
          id="replaceColours"
          v-model="action"
          type="radio"
          name="action"
          value="replaceColours"
          class="extractcolours-actioninput"
          tabindex="101"
        />
        <label for="replaceColours" class="extractcolours-actionlabel">
          <span class="extractcolours-radio"></span>Replace existing colours
        </label>
      </div>
      <div class="extractcolours-field extractcolours-action" :class="addColoursClass">
        <input
          id="addColours"
          v-model="action"
          type="radio"
          name="action"
          value="addColours"
          class="extractcolours-actioninput"
          :disabled="!canAddColours"
          tabinex="101"
        />
        <label for="addColours" class="extractcolours-actionlabel" :title="addColoursTitle">
          <span class="extractcolours-radio"></span>Add to existing colours
        </label>
      </div>
    </div>
    <button class="extractcolours-button extractcolours-button--extract" @click="extract">Extract</button>
    <button class="extractcolours-button extractcolours-button--cancel" @click="close">Cancel</button>
  </div>
</template>

<style scoped lang="less">
@import '../variables.less';

.extractcolours {
  color: lighten(#000, 10%);

  &:after {
    content: ' ';
    display: block;
    clear: both;
    width: 0;
    height: 0;
  }

  &-fields {
    font-size: 1.5rem;
    margin-bottom: 1.3rem;
  }

  &-field {
    margin-bottom: 1.5rem;
  }

  &-field--disabled {
    color: @tool-colour-disabled;
  }

  &-numberlabel {
    margin-right: 1rem;
  }

  &-numbercontrol {
    display: inline-block;

    &--focus {
      box-shadow: @box-shadow-active;
    }
  }

  &-numberstep {
    border: @border;
    display: inline-block;
    box-sizing: border-box;
    width: 3rem;
    height: 3rem;
    font-size: 1.5rem;
    line-height: 2.8rem;
    text-align: center;
    overflow: hidden;
  }

  &-numberinput {
    outline: none;
    display: inline-block;
    border: 0;
    border-top: @border;
    border-bottom: @border;
    box-sizing: border-box;
    height: 3rem;
    width: 4rem;
    text-align: center;
    font-size: 1.5rem;
    overflow: hidden;
    vertical-align: middle;
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
  }

  &-action {
    margin-bottom: 0.8rem;
  }

  &-actioninput {
    position: absolute;
    opacity: 0;
  }

  &-actionlabel {
    position: relative;
    display: inline-block;
    line-height: 1.8rem;
    vertical-align: middle;
  }

  &-radio {
    &:before {
      position: relative;
      display: inline-block;
      border: @border;
      border-radius: 50%;
      width: 1.8rem;
      height: 1.8rem;
      box-sizing: border-box;
      margin-right: 0.7rem;
      content: '';
      vertical-align: middle;
      top: -0.2rem;
    }

    &:hover:before {
      border-color: @tool-colour-active;
    }
  }

  &-actioninput:checked + &-actionlabel &-radio:before {
    background-color: @tool-colour-active;
    border-color: @tool-colour-active;
  }

  &-actioninput:focus + &-actionlabel &-radio:before {
    box-shadow: @box-shadow-active;
  }

  &-actioninput:checked + &-actionlabel &-radio:after {
    position: absolute;
    display: inline-block;
    background-color: #fff;
    border-radius: 50%;
    width: 0.8rem;
    height: 0.8rem;
    box-sizing: border-box;
    content: '';
    vertical-align: middle;
    top: 0.4rem;
    left: 0.5rem;
  }

  &-field--disabled &-radio {
    &:before {
      border-color: @border-colour;
    }

    &:hover:before {
      border-color: @border-colour;
    }
  }

  &-button {
    border: none;
    outline: none;
    padding: 0.5rem;
    font-size: 1.5rem;
    color: #fff;
    background-color: @button-colour;
    text-align: center;
    width: 15rem;
    float: right;
    margin-top: 1rem;
    margin-left: 1rem;

    &:hover {
      background-color: @button-colour-hover;
    }

    &:disabled {
      background-color: @button-colour-disabled;
    }
  }
}
</style>
