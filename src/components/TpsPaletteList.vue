<script setup>
import TpsPalette from './TpsPalette.vue'
import { useTpsFileStore } from '@/stores/tpsfile'

const tpsStore = useTpsFileStore()

const emit = defineEmits(['palette-double-click'])

function doubleClick(palette) {
  tpsStore.selectPalette(palette)
  emit('palette-double-click', palette)
}
</script>

<template>
  <ul class="palettelist">
    <TpsPalette
      v-for="palette in tpsStore.palettes"
      :key="palette.id"
      :palette="palette"
      @selected="tpsStore.selectPalette"
      @dblclick="doubleClick(palette)"
    />
  </ul>
</template>

<style scoped lang="less">
@import '../variables.less';

.palettelist {
  display: block;
  margin: 0;
  padding: 0;
  min-height: 20rem;
  max-height: 100%;
  border-radius: 0.2rem;
  box-sizing: border-box;
  box-shadow: 0rem 0rem 0.2rem 0.2rem @border-colour;
  overflow-y: scroll;

  &-draggable {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 5rem 5rem 5rem 5rem;
  }

  &-colour {
    display: block;
    position: relative;
  }
}
</style>
