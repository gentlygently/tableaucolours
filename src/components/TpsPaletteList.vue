<script setup>
import TpsPalette from './TpsPalette.vue'
import { useTpsFileStore } from '@/stores/tpsfile'

const tpsStore = useTpsFileStore()
</script>

<template>
  <ul class="palettelist">
    <TpsPalette
      v-for="palette in tpsStore.palettes"
      :key="palette.id"
      :palette="palette"
      @selected="tpsStore.selectPalette"
    />
  </ul>
</template>

<style scoped lang="less">
@import '../variables.less';

.palettelist {
  margin: 0;
  padding: 0;
  height: 30rem;
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
