<template>
    <div :class="activeClass">
        <canvas ref="image" @click="click"></canvas>
    </div>
</template>

<script>
export default {
  name: 'ScalableImage',
  props: {
    canPickColour: {
        type: Boolean
    },
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
      },
      activeClass () {
          return this.canPickColour ? 'active' : '';
      }
  },
  methods: {
      drawImage () {
        let canvas = this.$refs.image,
            drawingContext = this.getDrawingContext();

        canvas.width = this.width;
        canvas.height = this.height;
        
        drawingContext.scale(this.scale, this.scale);
        drawingContext.drawImage(this.image, 0, 0);
      },
      getDrawingContext () {
          return this.$refs.image.getContext('2d')
      },
      click (event) {
        if (!this.canPickColour) {
            return;
        }

        let colour = this.getDrawingContext().getImageData(event.offsetX, event.offsetY, 1, 1).data,
            hex = '#' + this.toHex(colour[0]) + this.toHex(colour[1]) + this.toHex(colour[2]);
        
        this.$emit('colour-picked', hex);
      },
      toHex(v) {
        let s = v.toString(16);
        return s.length == 1 ? '0' + s : s;
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
    .active canvas:hover {
        cursor: crosshair;
    }
</style>