<script setup>
import { computed, ref } from 'vue'
import TpsPalette from './TpsPalette.vue'
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
  tpsStore.selectPalette(palette)
  emit('double-click-palette', palette)
}

const clonePalette = palette => emit('clone-palette', palette)
const deletePalette = palette => emit('delete-palette', palette)
const paletteMoved = event => emit('move-palette', tpsStore.palettes[event.oldIndex], event.newIndex)
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
    <TpsPalette
      v-for="palette in palettes"
      :key="palette.id"
      :palette="palette"
      :can-move="tpsStore.canMovePalettes"
      class="palettelist-palette"
      @click.stop.prevent="tpsStore.selectPalette(palette)"
      @dblclick.stop.prevent="doubleClick(palette)"
      @delete="deletePalette"
      @clone="clonePalette"
    />
  </VueDraggable>
</template>

<style scoped lang="less">
@import '../variables.less';

.palettelist {
  display: block;
  margin: 0;
  padding: 0;
  height: 20rem;
  height: 100%;
  border-radius: 0.2rem;
  box-sizing: border-box;
  box-shadow: 0rem 0rem 0.2rem 0.2rem @border-colour;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: @background-colour;
}
</style>
