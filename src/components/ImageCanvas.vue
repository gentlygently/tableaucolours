<template>
    <div class="container" @wheel.shift="wheel">
        <scalable-image 
            v-show="hasImage" 
            :image="image" 
            :scale="scale" />
    </div>
</template>

<script>
import ScalableImage from './ScalableImage.vue'

export default {
  name: 'ImageCanvas',
  props: {
      image: HTMLImageElement
  },
  data() {
      return {
          scale: 1
      }
  },
  components: {
      ScalableImage
  },
  computed: {
      hasImage () {
          return this.image.width && this.image.height;
      }
  },
  methods: {
      wheel (event) {
        if (!event.deltaY) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (event.deltaY < 0 && this.scale <= 0.1) {
            return;
        }

        this.scale *= (event.deltaY < 0 ? 0.9 : 1.1);
      }
  }
}
</script>

<style scoped lang="less">

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    border: solid 0.1rem #000;
    box-sizing: border-box;
    background-color: #fff;
    background-image: linear-gradient(45deg, #ddd 26%, transparent 25%, transparent 75%, #ddd 75%), linear-gradient(45deg, #ddd 26%, transparent 25%, transparent 75%, #ddd 75%);
    background-position: 0 0, 1.5rem 1.5rem;
    background-size: 3rem 3rem;
    overflow: auto;
}

.imagecontainer.highlight {
    border-color: #358cd6;
    background-image: linear-gradient(45deg, #eaf3fb 26%, transparent 25%, transparent 75%, #eaf3fb 75%), linear-gradient(45deg, #eaf3fb 26%, transparent 25%, transparent 75%, #eaf3fb 75%);
}

.imagecolour {
    position: absolute;
    display: none;
    width: 5rem;
    height: 5rem;
    border: solid 1px #000;
    border-radius: 50%;
}

.imagecolour.active {
    display:block;
}
</style>