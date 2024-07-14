import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

let nextPaletteId = 1

const createPalette = (parsedPalette, isSelected) => ({ ...parsedPalette, id: nextPaletteId++, isSelected })

export const useTpsFileStore = defineStore('tpsFile', () => {
  const fileName = ref('')
  const palettes = ref([])
  const isOpen = computed(() => !!fileName.value)
  const hasSelectedPalette = computed(() => !!selectPalette.value)
  const selectedPalette = computed(() => palettes.value.find(x => x.isSelected))

  function open(name, parsedPalettes) {
    fileName.value = name
    palettes.value = parsedPalettes.map((p, i) => createPalette(p, i === 0))
  }

  function close() {
    fileName.value = ''
    palettes.value = []
  }

  const selectPalette = palette => palettes.value.map(x => (x.isSelected = x === palette))

  return { fileName, palettes, isOpen, selectedPalette, hasSelectedPalette, open, close, selectPalette }
})
