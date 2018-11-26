<template>
  <div
    class="imagecanvas"
    :class="dropClass"
    ref="container"
    @dragenter.prevent="dragEnter"
    @dragover.prevent="dragEnter"
    @dragleave.prevent="dragLeave"
    @drop.stop.prevent="drop"
  >
    <div class="imagecanvas-canvas" @wheel.shift="wheel">
      <scalable-image
        v-show="hasImage"
        :can-pick-colour="canPickColour"
        :image="image"
        :scale="scale"
        @colour-picked="colourPicked"
      />
    </div>
    <div class="canvashint" v-show="!hasImage || !canPickColour">
      <div class="canvashint-container">
        <div class="canvashint-text" v-show="!hasImage">
          <a href="#" @click.prevent="openFile">Open</a>, paste or drop an image to get started
        </div>
        <div
          class="canvashint-text"
          v-show="hasImage && !canPickColour"
        >Select a colour in the palette to pick colours from the image</div>
      </div>
    </div>
    <div class="droptarget" ref="droptarget">
      <div class="droptarget-textwrapper">
        <div class="droptarget-text">
          <span class="droptarget-icon fas fa-hand-point-down"></span>
          <br>Drop image here
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScalableImage from './ScalableImage.vue'
import { EventBus } from '../eventbus.js'

export default {
  name: 'ImageCanvas',
  props: {
    canPickColour: Boolean,
    image: HTMLImageElement,
    scale: Number
  },
  data: function () {
    return {
      isDropHighlightActive: false
    }
  },
  components: {
    ScalableImage
  },
  computed: {
    hasImage () {
      return this.image.width && this.image.height
    },
    dropClass () {
      return this.isDropHighlightActive ? 'imagecanvas--drop' : ''
    }
  },
  methods: {
    dragEnter (event) {
      if (
        event.dataTransfer.files.length ||
        [...event.dataTransfer.items].find(
          x => x.kind === 'file' && x.type.indexOf('image/' > -1)
        )
      ) {
        this.isDropHighlightActive = true
        event.dataTransfer.dropEffect = 'copy'
      }
    },
    dragLeave (event) {
      if (event.target === this.$refs.droptarget) {
        this.isDropHighlightActive = false
      }
    },
    drop (event) {
      this.isDropHighlightActive = false

      if (!event.dataTransfer || !event.dataTransfer.files) {
        return
      }

      this.$emit('file-dropped', event.dataTransfer.files)
    },
    colourPicked (colour) {
      this.$emit('colour-picked', colour)
    },
    openFile () {
      EventBus.$emit('open-image-file')
    },
    preventDefaults (event) {
      event.preventDefault()
      event.stopPropagation()
    },
    wheel (event) {
      if (!event.deltaY) {
        return
      }
      this.preventDefaults(event)
      this.$emit('zoom', this.scale * (event.deltaY > 0 ? 0.9 : 1.1))
    }
  },
  created: function () {
    window.addEventListener('dragover', this.preventDefaults, false)
    window.addEventListener('drop', this.preventDefaults, false)
  },
  destroyed: function () {
    window.removeEventListener('dragover', this.preventDefaults)
    window.removeEventListener('drop', this.preventDefaults)
  }
}
</script>

<style scoped lang="less">
.imagecanvas {
  width: 100%;
  height: 100%;
  position: relative;

  &-canvas {
    box-sizing: border-box;
    background-color: #fff;
    background-image: linear-gradient(
        45deg,
        #ddd 26%,
        transparent 25%,
        transparent 75%,
        #ddd 75%
      ),
      linear-gradient(
        45deg,
        #ddd 26%,
        transparent 25%,
        transparent 75%,
        #ddd 75%
      );
    background-position: 0 0, 1.5rem 1.5rem;
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
  z-index: 9996;
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
  z-index: 9997;
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
