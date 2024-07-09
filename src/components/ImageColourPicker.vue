<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ImageCanvas from './ImageCanvas.vue'
import ImageFileOpen from './ImageFileOpen.vue'
import ImageZoom from './ImageZoom.vue'
import { usePaletteStore } from '@/stores/palette'
import { useImageStore } from '@/stores/image'

const props = defineProps({ canPickColour: Boolean })

const imageStore = useImageStore()
const paletteStore = usePaletteStore()

const canvas = ref(null)

function colourPicked(hex) {
  paletteStore.updateSelectedColour(hex)
}

function displayFirstImage(files) {
  imageStore.displayFirstImage(files, canvas.value)
}

function fileSelected(files) {
  displayFirstImage([...files])
}

function paste(event) {
  if (
    !event.clipboardData ||
    !event.clipboardData.items ||
    event.target.tagName === 'INPUT' ||
    event.target.tagName === 'TEXTAREA'
  ) {
    return
  }

  const files = [...event.clipboardData.items].filter(i => i.kind === 'file').map(i => i.getAsFile())

  displayFirstImage(files)
}

onMounted(() => window.addEventListener('paste', paste, false))
onUnmounted(() => window.removeEventListener('paste', paste))
</script>

<template>
  <div class="imagecolourpicker">
    <div ref="canvas" class="imagecolourpicker-canvas">
      <ImageCanvas
        :image="imageStore.image"
        :scale="imageStore.scale"
        :can-pick-colour="props.canPickColour"
        @colour-picked="colourPicked"
        @file-dropped="fileSelected"
        @zoom="imageStore.zoom"
      />
    </div>
    <div class="imagecolourpicker-toolbar">
      <!--  TODO: Put these in a separate component -->
      <ul class="controls">
        <li class="zoomImage">
          <ImageZoom
            :scale="imageStore.scale"
            :range="imageStore.zoomRange"
            :enabled="imageStore.hasImage"
            @zoom="imageStore.zoom"
          />
        </li>
        <li class="selectFile">
          <ImageFileOpen @file-selected="fileSelected" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '../variables.less';

.imagecolourpicker {
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  align-content: stretch;
  height: 100%;
  width: 100%;

  &-canvas {
    width: 100%;
    min-height: 10rem;
    height: 10rem;
    flex-grow: 1;
    box-sizing: border-box;
  }
  &-toolbar {
    height: 4rem;
    width: 100%;
    box-sizing: border-box;
    background-color: @background-colour;
    border-top: @border;
    flex-shrink: 0;
    flex-grow: 0;
  }
  ul.controls {
    display: block;
    box-sizing: border-box;
    list-style: none;
    height: 100%;
    color: @tool-colour;
    text-align: right;
    margin: 0;
    padding: 0.5rem 0;
    white-space: nowrap;

    > li {
      display: inline-block;
      border-left: @border;
      text-align: center;
      vertical-align: middle;
      padding: 0 1rem;
      margin: 0;
      white-space: nowrap;

      button.button-icon {
        font-size: 2rem;
      }

      &:first-child {
        border: none;
      }
    }
  }
}
</style>
