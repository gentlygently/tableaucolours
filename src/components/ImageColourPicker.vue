<template>
  <div class="imagecolourpicker">
    <div class="imagecolourpicker-canvas" ref="canvas">
      <image-canvas
        :image="image"
        :scale="scale"
        :can-pick-colour="canPickColour"
        @colour-picked="colourPicked"
        @file-dropped="fileSelected"
        @zoom="zoom"
      />
    </div>
    <div class="imagecolourpicker-toolbar">
      <!--  TODO: Put these in a separate component -->
      <ul class="controls">
        <li class="zoomImage">
          <image-zoom :scale="scale" :range="zoomRange" :enabled="hasImage" @zoom="zoom"/>
        </li>
        <li class="selectFile">
          <image-file-open @file-selected="fileSelected"/>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ImageCanvas from './ImageCanvas.vue'
import ImageFileOpen from './ImageFileOpen.vue'
import ImageZoom from './ImageZoom.vue'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'ImageColourPicker',
  props: {
    canPickColour: Boolean
  },
  computed: {
    ...mapGetters({
      hasImage: 'image/hasImage'
    }),
    ...mapState({
      image: state => state.image.image,
      scale: state => state.image.scale,
      zoomRange: state => state.image.zoomRange
    })
  },
  components: {
    ImageCanvas,
    ImageFileOpen,
    ImageZoom
  },
  methods: {
    colourPicked (hex) {
      this.$store.dispatch('colour-picked', hex)
    },
    displayFirstImage (files) {
      this.$store.dispatch('image/displayFirstImage', {
        files,
        canvas: this.$refs.canvas
      })
    },
    fileSelected (files) {
      this.displayFirstImage([...files])
    },
    paste (event) {
      if (
        !event.clipboardData ||
        !event.clipboardData.items ||
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA'
      ) {
        return
      }

      const files = [...event.clipboardData.items]
        .filter(i => i.kind === 'file')
        .map(i => i.getAsFile())

      this.displayFirstImage(files)
    },
    zoom (scale) {
      this.$store.commit('image/zoom', { scale })
    }
  },
  created () {
    window.addEventListener('paste', this.paste, false)
  },
  destroyed () {
    window.removeEventListener('paste', this.paste)
  }
}
</script>

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
