<script setup>
import { computed, ref } from 'vue'
import TpsPaletteListItem from '../TpsPaletteListItem/TpsPaletteListItem.vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useTpsFileStore } from '@/stores/tpsfile'

const tpsStore = useTpsFileStore()

const emit = defineEmits(['double-click-palette', 'delete-palette', 'clone-palette', 'move-palette'])

const draggingActive = ref(false)
const palettes = computed({
  get() {
    return tpsStore.filteredPalettes
  },
  set() {
    // Do nothing (we handle the change in paletteMoved)
  },
})

function doubleClick(palette) {
  tpsStore.setCurrentPalette(palette)
  emit('double-click-palette', palette)
}

const clonePalette = palette => emit('clone-palette', palette)
const deletePalette = palette => emit('delete-palette', palette)
const paletteMoved = event => emit('move-palette', tpsStore.palettes[event.oldIndex], event.newIndex)

const toggleSelected = palette => {
  palette.isSelected = !palette.isSelected
}

const paletteCount = computed(() => {
  const count = tpsStore.palettes.length
  let message = `${count} colour palette${count === 1 ? '' : 's'}`

  const additional = []
  if (tpsStore.hasActiveFilters) additional.push(`showing ${tpsStore.filteredPalettes.length}`)
  if (tpsStore.hasSelectedPalettes) additional.push(`${tpsStore.selectedPalettes.length} selected`)
  if (additional.length) message += ` (${additional.join(', ')})`

  return message
})
</script>

<template>
  <VueDraggable
    v-model="palettes"
    class="palettelist"
    :options="{ delay: 25 }"
    :disabled="!tpsStore.canMovePalettes"
    tag="ul"
    draggable="li"
    @update="paletteMoved"
    @start="draggingActive = true"
    @end="draggingActive = false"
  >
    <TpsPaletteListItem
      v-for="palette in palettes"
      :key="palette.id"
      :palette="palette"
      :can-move="tpsStore.canMovePalettes"
      class="palettelist-palette"
      @click.stop.prevent="tpsStore.setCurrentPalette(palette)"
      @dblclick.stop.prevent="doubleClick(palette)"
      @delete="deletePalette"
      @clone="clonePalette"
      @toggle-selected="toggleSelected"
    />
  </VueDraggable>
  <div class="palettecount">{{ paletteCount }}</div>
</template>

<style scoped lang="less">
@import '../../variables.less';

.palettelist {
  display: block;
  margin: 0;
  padding: 0;
  height: 20rem;
  height: 100%;
  border-radius: 0.2rem;
  box-sizing: border-box;
  box-shadow: @box-shadow;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: @background-colour;
}
.palettecount {
  margin-top: 0.5rem;
}
</style>
