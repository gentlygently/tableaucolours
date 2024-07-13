import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

let nextColourId = 1
const defaultType = 'regular'

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

  const canAddColour = computed(() => colours.value.length < maximumColours.value)

  const canPickColour = computed(() => isOpen.value && !!selectedColour.value)

  const selectedColour = computed(() => colours.value.find(x => x.isSelected))

  const open = () => (isOpen.value = true)

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
    selectColour(colours.value[colours.value.length - 1])
  }

  function addColours(hexes) {
    const colourCapacity = maximumColours.value - colours.value.length
    if (hexes.length > colourCapacity) {
      hexes = hexes.slice(0, colourCapacity)
    }
    hexes.forEach(x => colours.value.push(createColour(x)))
  }

  function updateColour(colour, hex) {
    colour.hex = hex
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
  }

  function removeColour(colour) {
    colours.value = colours.value.filter(x => x !== colour)
  }

  function replacePalette(paletteName, paletteType, paletteColours) {
    name.value = paletteName || ''
    type.value = paletteType || 'regular'
    replaceColours(paletteColours)
  }

  function replaceColours(hexes) {
    if (hexes && hexes.length > maximumColours.value) {
      hexes = hexes.slice(0, maximumColours.value)
    }
    colours.value = createColours(hexes, true)
  }

  const resetPalette = () => replacePalette('', defaultType)

  return {
    name,
    type,
    maximumColours,
    colours,
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
    removeColour,
    replacePalette,
    replaceColours,
    resetPalette,
  }
})
