<template>
    <image-canvas :image="image" class="canvas" />
</template>

<script>
import ImageCanvas from './ImageCanvas.vue'

export default {
  name: 'ImageColourPicker',
  props: {
    
  },
  data() {
      return {
          image: new Image()
      }
  },
  components: {
      ImageCanvas
  },
  methods: {
      paste(event) {
        if (!event.clipboardData || !event.clipboardData.items) {
            return;
        }

        let files = [...event.clipboardData.items]
            .filter(i => i.kind === 'file')
            .map (i => i.getAsFile());

        let file = files.find(i => i.type.indexOf('image/') > -1);

        if (!file) {
            console.log('Clipboard did not contain image');
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
.canvas {
    width: 100%;
    height: 100%;
}
</style>