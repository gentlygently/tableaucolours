import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { PaletteTypes } from '../PaletteTypes'

let nextColourId = 1
const defaultType = PaletteTypes.regular.id

function createColours(colours, selectFirstColour) {
  colours = colours || ['#FFFFFF']
  return colours.map((c, i) => createColour(c, selectFirstColour && i === 0))
}

function createColour(hex, isSelected) {
  if (!hex) {
    hex = '#FFFFFF'
  }
  return {
    id: nextColourId++,
    hex: hex.toUpperCase(),
    isSelected: isSelected === true,
  }
}

export const usePaletteStore = defineStore('palette', () => {
  const name = ref('')
  const type = ref(defaultType)
  const maximumColours = ref(20)
  const colours = ref(createColours(null, true))
  const isOpen = ref(false)
  const hasChanges = ref(false)

  const canAddColour = computed(() => colours.value.length < maximumColours.value)

  const canPickColour = computed(() => isOpen.value && !!selectedColour.value)

  const selectedColour = computed(() => colours.value.find(x => x.isSelected))

  function open(palette) {
    if (palette) replacePalette(palette.name, palette.type, palette.colours)
    else resetPalette()
    hasChanges.value = false
    isOpen.value = true
  }

  const close = () => (isOpen.value = false)

  function selectColour(colour) {
    colours.value.forEach(x => {
      x.isSelected = x === colour
    })
  }

  function addColour() {
    if (colours.value.length >= maximumColours.value) {
      return
    }
    colours.value.push(createColour('#FFFFFF'))
    hasChanges.value = true
    selectColour(colours.value[colours.value.length - 1])
  }

  function addColours(hexes) {
    const colourCapacity = maximumColours.value - colours.value.length
    if (hexes.length > colourCapacity) {
      hexes = hexes.slice(0, colourCapacity)
    }
    if (!hexes.length) return

    hexes.forEach(x => colours.value.push(createColour(x)))
    hasChanges.value = true
  }

  function updateColour(colour, hex) {
    colour.hex = hex
    hasChanges.value = true
  }

  function updateSelectedColour(hex) {
    if (selectedColour.value) {
      updateColour(selectedColour.value, hex)
    }
  }

  function moveColour(colour, newIndex) {
    let c = colours.value
    const oldIndex = c.indexOf(colour)
    c.splice(newIndex, 0, c.splice(oldIndex, 1)[0])
    hasChanges.value = true
  }

  function reverseColours() {
    let c = colours.value
    if (c.length > 1) {
      c.reverse()
      hasChanges.value = true
    }
  }

  function removeColour(colour) {
    const c = colours.value
    const index = c.findIndex(x => x === colour)
    if (index < 0) return
    c.splice(index, 1)
    hasChanges.value = true

    if (!colour.isSelected || !c.length) return
    selectColour(c[index >= c.length ? c.length - 1 : index])
  }

  function replacePalette(paletteName, paletteType, paletteColours) {
    name.value = paletteName || ''
    type.value = paletteType || defaultType
    replaceColours(paletteColours)
  }

  function replaceColours(hexes) {
    if (hexes && hexes.length > maximumColours.value) {
      hexes = hexes.slice(0, maximumColours.value)
    }
    colours.value = createColours(hexes, true)
    hasChanges.value = true
  }

  const resetPalette = () => replacePalette('', defaultType)

  // We flush immediately and synchronously to make sure the watchers run immediately
  // after resetting name and type (in open()). Using the default behaviour, the watchers
  // run after we've set hasChanges to false.
  watch(name, () => (hasChanges.value = true), { immediate: true, flush: 'sync' })
  watch(type, () => (hasChanges.value = true), { immediate: true, flush: 'sync' })

  return {
    name,
    type,
    maximumColours,
    selectedColour,
    colours,
    hasChanges,
    isOpen,
    canAddColour,
    canPickColour,
    open,
    close,
    selectColour,
    addColour,
    addColours,
    updateColour,
    updateSelectedColour,
    moveColour,
    reverseColours,
    removeColour,
    replacePalette,
    replaceColours,
    resetPalette,
  }
})
