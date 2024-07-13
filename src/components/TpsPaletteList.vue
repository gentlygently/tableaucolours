<script setup>
import TpsPalette from './TpsPalette.vue'
defineProps({ palettes: { type: Array, required: true } })

const emit = defineEmits(['palette-selected'])

const paletteSelected = palette => emit('palette-selected', palette)
</script>

<template>
  <ul class="palettelist">
    <TpsPalette v-for="palette in palettes" :key="palette.id" :palette="palette" @selected="paletteSelected" />
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
