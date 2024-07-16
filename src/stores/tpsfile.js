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
  const file = ref({})
  const palettes = ref([])
  const hasChanges = ref(false)
  const fileContents = computed(() => file.value.contents || '')
  const fileName = computed(() => file.value.name || '')
  const isOpen = computed(() => !!file.value.name)
  const hasSelectedPalette = computed(() => !!selectedPalette.value)
  const selectedPalette = computed(() => palettes.value.find(x => x.isSelected))

  function open(name, xml, parsedPalettes) {
    file.value = { name, contents: xml }
    palettes.value = parsedPalettes.map((p, i) => createPalette(p, i === 0))
    hasChanges.value = false
  }

  function close() {
    file.value = null
    palettes.value = []
  }

  function saved(newFileName) {
    palettes.value.forEach(x => (x.hasChanges = false))

    if (newFileName) file.value.name = newFileName

    hasChanges.value = false
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
    file,
    fileContents,
    fileName,
    palettes,
    hasChanges,
    isOpen,
    selectedPalette,
    hasSelectedPalette,
    open,
    close,
    saved,
    selectPalette,
    addPalette,
    updateSelectedPalette,
    deletePalette,
    movePalette,
  }
})
