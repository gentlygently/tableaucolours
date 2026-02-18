<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ScalableImage from '../ScalableImage/ScalableImage.vue'
import { eventBus } from '@/eventbus'

const props = defineProps({
  canPickColour: Boolean,
  image: HTMLImageElement,
  isPaletteOpen: Boolean,
  isTpsFileOpen: Boolean,
  scale: { type: Number, default: 1 },
})

const emit = defineEmits(['file-dropped', 'colour-picked', 'zoom'])

const dropTarget = ref(null)
const isDropHighlightActive = ref(false)

const hasImage = computed(() => props.image.width && props.image.height)
const dropClass = computed(() => (isDropHighlightActive.value ? 'imagecanvas--drop' : ''))

function dragEnter(event) {
  if ([...event.dataTransfer.items].find(x => x.kind === 'file' && x.type.indexOf('image/') > -1)) {
    isDropHighlightActive.value = true
    event.dataTransfer.dropEffect = 'copy'
  }
}

function dragLeave(event) {
  if (event.target === dropTarget.value) {
    isDropHighlightActive.value = false
  }
}

function drop(event) {
  isDropHighlightActive.value = false

  if (!event.dataTransfer || !event.dataTransfer.files) {
    return
  }

  emit('file-dropped', event.dataTransfer.files)
}

function colourPicked(colour) {
  emit('colour-picked', colour)
}

function openImageFile() {
  eventBus.emit('open-image-file')
}

function wheel(event) {
  if (!event.deltaY) {
    return
  }
  preventDefaults(event)
  emit('zoom', props.scale * (event.deltaY > 0 ? 0.9 : 1.1))
}

const messageType = computed(() => {
  if (!hasImage.value) return 'image'
  else if (!props.canPickColour) return 'colour'
  return null
})
const hasMessage = computed(() => messageType.value !== null)

onMounted(() => {
  window.addEventListener('dragover', preventDefaults, false)
  window.addEventListener('drop', preventDefaults, false)
})

onUnmounted(() => {
  window.removeEventListener('dragover', preventDefaults)
  window.removeEventListener('drop', preventDefaults)
})

function preventDefaults(event) {
  event.preventDefault()
  event.stopPropagation()
}
</script>

<template>
  <div
    class="imagecanvas"
    :class="dropClass"
    @dragenter.prevent="dragEnter"
    @dragover.prevent="dragEnter"
    @dragleave.prevent="dragLeave"
    @drop.stop.prevent="drop"
  >
    <div class="imagecanvas-canvas" @wheel.shift="wheel">
      <ScalableImage
        v-show="hasImage"
        :can-pick-colour="props.canPickColour"
        :image="props.image"
        :scale="props.scale"
        @colour-picked="colourPicked"
      />
    </div>
    <div v-show="hasMessage" class="canvashint">
      <div class="canvashint-container">
        <div v-show="messageType === 'image'" class="canvashint-text">
          <a href="#" @click.prevent="openImageFile">Open</a>, paste or drop an image to get started
        </div>
        <div v-show="messageType === 'colour'" class="canvashint-text">
          Select a colour in the palette to pick colours from the image
        </div>
      </div>
    </div>
    <div ref="dropTarget" class="droptarget">
      <div class="droptarget-textwrapper">
        <div class="droptarget-text">
          <span class="droptarget-icon fas fa-hand-point-down"></span>
          <br />Drop image here
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.imagecanvas {
  width: 100%;
  height: 100%;
  position: relative;

  &-canvas {
    box-sizing: border-box;
    background-color: #fff;
    background-image: linear-gradient(45deg, #ddd 26%, transparent 25%, transparent 75%, #ddd 75%),
      linear-gradient(45deg, #ddd 26%, transparent 25%, transparent 75%, #ddd 75%);
    background-position:
      0 0,
      1.5rem 1.5rem;
    background-size: 3rem 3rem;
    overflow: auto;
    position: relative;
    width: 100%;
    height: 100%;
  }
  &--drop {
    .canvashint {
      display: none;
    }
    .droptarget {
      display: table;
    }
  }
}
.canvashint {
  display: table;
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  &-container {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }
  &-text {
    padding: 3rem;
    border-radius: 0.5rem;
    margin: 0 auto;
    color: #fff;
    background-color: #00000077;
    font-size: 1.5rem;
    display: inline-block;
    a,
    a:visited {
      color: #fff;
    }
  }
}
.droptarget {
  position: absolute;
  display: none;
  box-sizing: border-box;
  border: 0.4rem dashed #fff;
  background-color: #000000aa;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1001;
  & * {
    pointer-events: none;
  }
  &-textwrapper {
    display: table-cell;
    vertical-align: middle;
  }
  &-text {
    margin: 0 auto;
    color: #fff;
    font-size: 2.5rem;
    text-align: center;
  }
  &-icon {
    font-size: 3rem;
  }
}
</style>
