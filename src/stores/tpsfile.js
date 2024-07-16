import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

let nextPaletteId = 1

const createPalette = (palette, isSelected) => ({
  id: nextPaletteId++,
  name: palette.name,
  type: palette.type,
  colours: mapColours(palette.colours),
  isSelected: !!isSelected,
  hasChanges: false,
})

const mapColours = colours => colours.map(x => (typeof x === 'string' ? x : x.hex))

export const useTpsFileStore = defineStore('tpsFile', () => {
  const fileName = ref('')
  const palettes = ref([])
  const hasChanges = ref(false)
  const isOpen = computed(() => !!fileName.value)
  const hasSelectedPalette = computed(() => !!selectedPalette.value)
  const selectedPalette = computed(() => palettes.value.find(x => x.isSelected))

  function open(name, parsedPalettes) {
    fileName.value = name
    palettes.value = parsedPalettes.map((p, i) => createPalette(p, i === 0))
  }

  function close() {
    fileName.value = ''
    palettes.value = []
  }

  const selectPalette = palette => palettes.value.forEach(x => (x.isSelected = x === palette))

  function addPalette(name, type, colours) {
    palettes.value.push(createPalette({ name, type, colours }))
    const palette = palettes.value.slice(-1)[0]
    selectPalette(palette)
    palette.hasChanges = true
    hasChanges.value = true
  }

  function updateSelectedPalette(name, type, colours) {
    const palette = selectedPalette.value

    palette.name = name
    palette.type = type
    palette.colours = mapColours(colours)
    palette.hasChanges = true
    hasChanges.value = true
  }

  function deletePalette(palette) {
    const index = palettes.value.indexOf(palette)

    if (index < 0) return

    const p = palettes.value
    p.splice(index, 1)
    hasChanges.value = true

    if (palette.isSelected && p.length > 0) selectPalette(p[index >= p.length ? p.length - 1 : index])
  }

  function movePalette(palette, newIndex) {
    const p = palettes.value
    const oldIndex = p.indexOf(palette)
    p.splice(newIndex, 0, p.splice(oldIndex, 1)[0])
    hasChanges.value = true
  }

  return {
    fileName,
    palettes,
    hasChanges,
    isOpen,
    selectedPalette,
    hasSelectedPalette,
    open,
    close,
    selectPalette,
    addPalette,
    updateSelectedPalette,
    deletePalette,
    movePalette,
  }
})
