<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import ImageColourSwatch from '../ImageColourSwatch.vue'

const props = defineProps({
  canPickColour: {
    type: Boolean,
  },
  image: {
    type: HTMLImageElement,
    required: true,
  },
  scale: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['colour-picked'])

const imageCanvas = ref(null)
const defaultMousePosition = { x: 0, y: 0 }
const mousePosition = ref(defaultMousePosition)
const currentColour = ref('')
const image = computed(() => props.image)
const scale = computed(() => props.scale)
const height = computed(() => props.image.height * props.scale)
const width = computed(() => props.image.width * props.scale)

watch(image, resetImage)
watch(scale, resetImage)
onMounted(() => {
  if (image.value) resetImage()
})

function resetImage() {
  resetMouseAndColour()
  drawImage()
}

function drawImage() {
  const drawingContext = getDrawingContext()

  imageCanvas.value.width = width.value
  imageCanvas.value.height = height.value
  drawingContext.scale(scale.value, scale.value)
  drawingContext.drawImage(image.value, 0, 0)
}

function getDrawingContext() {
  return imageCanvas.value.getContext('2d')
}

function click(event) {
  if (!props.canPickColour) {
    return
  }
  setMouseAndColour(event)
  if (currentColour.value) {
    emit('colour-picked', currentColour.value)
  }
}

function toHex(v) {
  const s = v.toString(16).toUpperCase()
  return s.length === 1 ? '0' + s : s
}

function setMouseAndColour(event) {
  setCurrentColour(event)
  setMousePosition(event)
}

function resetMouseAndColour() {
  currentColour.value = ''
  mousePosition.value = defaultMousePosition
}

function setCurrentColour(event) {
  const colour = getDrawingContext().getImageData(event.offsetX, event.offsetY, 1, 1).data

  if (colour[3] === 0) {
    currentColour.value = ''
    return
  }

  currentColour.value = '#' + toHex(colour[0]) + toHex(colour[1]) + toHex(colour[2])
}

function setMousePosition(event) {
  mousePosition.value = { x: event.offsetX, y: event.offsetY }
}
</script>

<template>
  <div class="scalableimage">
    <div class="scalableimage-hackyverticalspacer">&nbsp;</div>
    <div class="scalableimage-image" :class="{ 'scalableimage-image--active': props.canPickColour }">
      <ImageColourSwatch
        v-show="props.canPickColour && currentColour"
        :colour="currentColour"
        :mouse-position="mousePosition"
      />
      <canvas
        ref="imageCanvas"
        @click="click"
        @mouseover="setMouseAndColour"
        @mousemove="setMouseAndColour"
        @mouseleave="resetMouseAndColour"
      ></canvas>
    </div>
  </div>
</template>

<style scoped lang="less">
.scalableimage {
  width: 100%;
  height: 100%;
  text-align: center;
  white-space: nowrap;

  &-hackyverticalspacer {
    display: inline-block;
    content: '';
    height: 100%;
    vertical-align: middle;
    width: 0;
  }
  &-image {
    display: inline-block;
    vertical-align: middle;
    position: relative;

    &--active canvas:hover {
      cursor: crosshair;
    }
  }
}
</style>
