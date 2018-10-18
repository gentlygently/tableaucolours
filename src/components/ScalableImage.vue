<template>
    <canvas ref="image"></canvas>
</template>

<script>
export default {
  name: 'ScalableImage',
  props: {
    image: {
        type: HTMLImageElement,
        required: true
    },
    scale: {
        type: Number,
        required: true
    }
  },
  computed: {
      height () {
        return this.image.height * this.scale;
      },
      width () {
        return this.image.width * this.scale;
      }
  },
  methods: {
      drawImage () {
        
        let canvas = this.$refs.image,
            drawingContext = canvas.getContext('2d');

        canvas.width = this.width;
        canvas.height = this.height;
        
        drawingContext.scale(this.scale, this.scale);
        drawingContext.drawImage(this.image, 0, 0);
      }
  },
  watch: {
      image () {
        this.drawImage();
      },
      scale () {
        this.drawImage();
      }
  }
}
</script>

<style scoped lang="less">

</style>