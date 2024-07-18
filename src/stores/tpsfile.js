import { defineStore } from 'pinia'
import { computed, ref, watchEffect } from 'vue'

let nextPaletteId = 1

const createPalette = (palette, isCurrent) => ({
  id: nextPaletteId++,
  name: palette.name,
  type: palette.type,
  colours: mapColours(palette.colours),
  isCurrent: !!isCurrent,
  hasChanges: false,
})

const mapColours = colours => colours.map(x => (typeof x === 'string' ? x : x.hex))

class NameFilter {
  #isMatch
  constructor(name, noName) {
    this.name = name.toLowerCase()
    this.noName = noName

    if (noName && name) this.#isMatch = this.#hasMatchingOrNoName
    else if (!noName && name) this.#isMatch = this.#hasMatchingName
    else this.#isMatch = this.#hasNoName
  }

  isMatch = palette => this.#isMatch(palette)

  #hasNoName = palette => !palette.name
  #hasMatchingName = palette => palette.name && palette.name.toLowerCase().includes(this.name)
  #hasMatchingOrNoName = palette => !palette.name || palette.name.toLowerCase().includes(this.name)
}

class TypeFilter {
  constructor(types) {
    this.types = types
  }

  isMatch = palette => this.types.indexOf(palette.type) > -1
}

export const useTpsFileStore = defineStore('tpsFile', () => {
  const file = ref({})
  const palettes = ref([])
  const hasChanges = ref(false)
  const fileContents = computed(() => file.value.contents || '')
  const fileName = computed(() => file.value.name || '')
  const isOpen = computed(() => !!file.value.name)
  const hasCurrentPalette = computed(() => !!currentPalette.value)
  const currentPalette = computed(() => filteredPalettes.value.find(x => x.isCurrent))
  const canMovePalettes = computed(() => !hasActiveFilters.value)
  const isFilterActive = ref(false)
  const paletteFilters = ref([])
  const paletteNameFilter = ref('')
  const paletteNoNameFilter = ref(false)
  const paletteTypeFilter = ref([])

  const hasActiveFilters = computed(() => isFilterActive.value && paletteFilters.value.length)

  const filteredPalettes = computed(() => {
    const filters = paletteFilters.value

    if (!hasActiveFilters.value) return palettes.value

    const isMatch = filters.length == 1 ? filters[0].isMatch : p => filters.every(x => x.isMatch(p))

    return palettes.value.filter(isMatch)
  })

  const arePalettesFiltered = computed(() => {
    filteredPalettes.value.length != palettes.value.length
  })

  function open(name, xml, parsedPalettes) {
    file.value = { name, contents: xml }
    palettes.value = parsedPalettes.map((p, i) => createPalette(p, i === 0))
    hasChanges.value = false
  }

  function close() {
    file.value = {}
    palettes.value = []
  }

  function saved(newFileName) {
    palettes.value.forEach(x => (x.hasChanges = false))

    if (newFileName) file.value.name = newFileName

    hasChanges.value = false
  }

  const setCurrentPalette = palette => filteredPalettes.value.forEach(x => (x.isCurrent = x === palette))

  function addPalette(name, type, colours) {
    palettes.value.push(createPalette({ name, type, colours }))
    const palette = palettes.value.slice(-1)[0]
    setCurrentPalette(palette)
    palette.hasChanges = true
    hasChanges.value = true
  }

  function updateCurrentPalette(name, type, colours) {
    const palette = currentPalette.value

    palette.name = name
    palette.type = type
    palette.colours = mapColours(colours)
    palette.hasChanges = true
    hasChanges.value = true
  }

  function deletePalette(palette) {
    const index = palettes.value.indexOf(palette)

    if (index < 0) return

    let currentIndex = -1
    if (palette.isCurrent) {
      currentIndex = arePalettesFiltered.value ? filteredPalettes.value.indexOf(palette) : index
    }

    const p = palettes.value
    p.splice(index, 1)
    hasChanges.value = true

    const f = filteredPalettes.value
    if (currentIndex >= 0 && f.length > 0) {
      setCurrentPalette(f[currentIndex >= f.length ? f.length - 1 : currentIndex])
    }
  }

  function movePalette(palette, newIndex) {
    if (!canMovePalettes.value) {
      console.debug('Attempted to move with active filter')
      return
    }
    const p = palettes.value
    const oldIndex = p.indexOf(palette)
    p.splice(newIndex, 0, p.splice(oldIndex, 1)[0])
    hasChanges.value = true
  }

  watchEffect(() => {
    const newFilters = []
    if (paletteNameFilter.value || paletteNoNameFilter.value)
      newFilters.push(new NameFilter(paletteNameFilter.value, paletteNoNameFilter.value))
    if (paletteTypeFilter.value.length) newFilters.push(new TypeFilter(paletteTypeFilter.value))

    paletteFilters.value = newFilters
  })

  return {
    file,
    fileContents,
    fileName,
    palettes,
    filteredPalettes,
    hasChanges,
    isOpen,
    currentPalette,
    hasCurrentPalette,
    canMovePalettes,
    open,
    close,
    saved,
    setCurrentPalette,
    addPalette,
    updateCurrentPalette,
    deletePalette,
    movePalette,
    isFilterActive,
    hasActiveFilters,
    arePalettesFiltered,
    paletteFilters,
    paletteNameFilter,
    paletteNoNameFilter,
    paletteTypeFilter,
  }
})
