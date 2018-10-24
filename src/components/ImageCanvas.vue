<template>
    <div class="imagecanvas" 
        :class="highlightClass"
        @wheel.shift="wheel" 
        @dragenter.stop.prevent="drageEnter"
        @dragover.stop.prevent="dragEnter"
        @dragleave.stop.prevent="dragLeave"
        @drop.stop.prevent="drop">
        <scalable-image 
            v-show="hasImage"
            :can-pick-colour="canPickColour" 
            :image="image" 
            :scale="scale"
            @colour-picked="colourPicked" />
    </div>
</template>

<script>
import ScalableImage from './ScalableImage.vue'

export default {
  name: 'ImageCanvas',
  props: {
      canPickColour: Boolean,
      isDropHighlightActive: Boolean,
      image: HTMLImageElement,
      scale: Number
  },
  components: {
      ScalableImage
  },
  computed: {
      hasImage () {
          return this.image.width && this.image.height;
      },
      highlightClass () {
          return this.isDropHighlightActive ? 'imagecanvas--highlight' : '';
      }
  },
  methods: {
      dragEnter (event) {
        if (event.dataTransfer.files.length || [...event.dataTransfer.items].find(x => x.kind === 'file' && x.type.indexOf('image/' > -1))) {
            this.isDropHighlightActive = true;
            event.dataTransfer.dropEffect = 'copy';
        }
      },
      dragLeave (event) {
        this.isDropHighlightActive = false;
      },
      drop (event) {
        this.isDropHighlightActive = false;

        if (!event.dataTransfer || !event.dataTransfer.files) {
            return;
        }

        this.$emit('file-dropped', event.dataTransfer.files);
      },
      colourPicked (colour) {
          this.$emit('colour-picked', colour);
      },
      preventDefaults(event) {
        event.preventDefault();
        event.stopPropagation();
      },
      wheel (event) {
        if (!event.deltaY) {
            return;
        }
        this.preventDefaults(event);
        this.$emit('zoom', this.scale * (event.deltaY > 0 ? 0.9 : 1.1));
      }
  },
  created: function() {
      window.addEventListener('dragover', this.preventDefaults, false);
      window.addEventListener('drop', this.preventDefaults, false);
  },
  destroyed: function() {
      window.removeEventListener('dragover', this.preventDefaults);
      window.removeEventListener('drop', this.preventDefaults);
  }
}
</script>

<style scoped lang="less">

.imagecanvas {
    box-sizing: border-box;
    background-color: #fff;
    background-image: linear-gradient(45deg, #ddd 26%, transparent 25%, transparent 75%, #ddd 75%), linear-gradient(45deg, #ddd 26%, transparent 25%, transparent 75%, #ddd 75%);
    background-position: 0 0, 1.5rem 1.5rem;
    background-size: 3rem 3rem;
    overflow: auto;
    position: relative;
    width: 100%;
    height: 100%;

    &--highlight {
        background-image: linear-gradient(45deg, #eaf3fb 26%, transparent 25%, transparent 75%, #eaf3fb 75%), linear-gradient(45deg, #eaf3fb 26%, transparent 25%, transparent 75%, #eaf3fb 75%);
    }
}

</style>