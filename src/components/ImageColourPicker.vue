<template>
    <div class="container">
        <div class="canvas">
            <image-canvas 
                :image="image" 
                :can-pick-colour="canPickColour"
                @colour-picked="colourPicked" />
        </div>
        <div class="controls">
            <image-file-open @file-selected="fileSelected" />
        </div>
    </div>
</template>

<script>
import ImageCanvas from './ImageCanvas.vue'
import ImageFileOpen from './ImageFileOpen.vue'

export default {
  name: 'ImageColourPicker',
  props: {
    canPickColour: Boolean
  },
  data() {
      return {
          image: new Image()
      }
  },
  components: {
      ImageCanvas,
      ImageFileOpen
  },
  methods: {
      colourPicked (colour) {
          this.$emit('colour-picked', colour);
      },
      displayFirstImage (files) {
        const file = files
            .find(i => i.type.indexOf('image/') > -1);

        if (!file) {
            console.log('File list did not contain image');
            return;
        }

        let vm = this;
        let reader = new FileReader();
        reader.onload = function() {
            var tempImage = new Image();
            tempImage.onload = function() {
                vm.scale = 1;
                vm.image = this;
            };
            tempImage.src = reader.result;
        }
        reader.readAsDataURL(file); 
      },
      fileSelected (files) {
        this.displayFirstImage([...files]);          
      },
      paste(event) {
        if (!event.clipboardData || !event.clipboardData.items) {
            return;
        }
         const files = [...event.clipboardData.items]
            .filter(i => i.kind === 'file')
            .map(i => i.getAsFile());

        this.displayFirstImage(files);
      }
  },
  created () {
      window.addEventListener('paste', this.paste, false);
  },
  destroyed () {
      window.removeEventListener('paste', this.paste);
  }
}
</script>

<style scoped lang="less">
div.container {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    align-content: stretch;
    height: 100%;
    width: 100%;
}
div.canvas {
    width: 100%;
    min-height: 10rem;
    height: 10rem;
    flex-grow: 1;
    box-sizing: border-box;
}
div.controls {
    height: 4rem;
    width: 100%;
    box-sizing: border-box;
    background-color: #efeceb;
    border-top: 0.1rem solid #d8d5d3;
    flex-shrink: 0;
    flex-grow: 0; 
    padding: 0.5rem;
    line-height: 2.9rem;
    font-size: 2rem;
    color: #73716f;
}
</style>