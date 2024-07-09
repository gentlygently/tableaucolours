<script setup>
import { computed } from 'vue'

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
    case 'regular':
      return regular(props.colours)

    case 'ordered-diverging':
    case 'ordered-sequential':
      return ordered(props.colours)
  }
  return ''
})

function regular(colours) {
  const width = 100 / colours.length
  let position = 0
  return `linear-gradient(to right, ${colours
    .map(x => `${x.hex} ${position}%, ${x.hex} ${(position += width)}%`)
    .join(', ')})`
}

function ordered(colours) {
  return `linear-gradient(to right, ${colours.map(x => x.hex).join(', ')})`
}
</script>

<template>
  <div class="palettepreview" :style="{ background: backgroundStyle }">&nbsp;</div>
</template>

<style scoped lang="less">
@import '../variables.less';

.palettepreview {
  height: 3rem;
  border-radius: 0.2rem;
  box-sizing: border-box;
  box-shadow: 0rem 0rem 0.2rem 0.2rem @border-colour;
}
</style>
