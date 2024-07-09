<script setup>
import { computed } from 'vue'

const props = defineProps({
  colour: {
    type: String,
    required: true,
  },
  mousePosition: {
    type: Object,
    required: true,
  },
})

const swatchStyle = computed(() => ({
  'background-color': props.colour,
  top: props.mousePosition.y - 40 + 'px',
  left: props.mousePosition.x + 10 + 'px',
}))
</script>

<template>
  <div class="imagecolourswatch" :style="swatchStyle">&nbsp;</div>
</template>

<style scoped lang="less">
@import '../variables.less';

.imagecolourswatch {
  display: block;
  position: absolute;
  width: 4rem;
  height: 4rem;
  border: @border;
  border-radius: 50%;
}
</style>
