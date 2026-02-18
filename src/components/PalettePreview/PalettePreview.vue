<script setup>
import { computed } from 'vue'
import { PaletteTypes } from '../../PaletteTypes'

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  colours: {
    type: Array,
    required: true,
  },
})

const backgroundStyle = computed(() => {
  switch (props.type) {
    case PaletteTypes.regular.id:
      return regular(props.colours)

    case PaletteTypes.diverging.id:
    case PaletteTypes.sequential.id:
      return ordered(props.colours)
  }
  return ''
})

function regular(colours) {
  const width = 100 / colours.length
  let position = 0
  return `linear-gradient(to right, ${colours
    .map(hex)
    .map(x => `${x} ${position}%, ${x} ${(position += width)}%`)
    .join(', ')})`
}

function ordered(colours) {
  return `linear-gradient(to right, ${colours.map(hex).join(', ')})`
}

const hex = colour => (typeof colour === 'string' ? colour : colour.hex)
</script>

<template>
  <div class="palettepreview" :style="{ background: backgroundStyle }">&nbsp;</div>
</template>

<style scoped lang="less">
@import '../../variables.less';

.palettepreview {
  height: 100%;
  border-radius: 0.2rem;
  box-sizing: border-box;
  box-shadow: 0rem 0rem 0.2rem 0.2rem @border-colour;
}
</style>
