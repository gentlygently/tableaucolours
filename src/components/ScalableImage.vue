<template>
    <div class="scalableimage">
        <div class="scalableimage-hackyverticalspacer">&nbsp;</div>
        <div class="scalableimage-image" :class="{'scalableimage-image--active': canPickColour}">
            <image-colour-swatch
                v-show="canPickColour && currentColour"
                :colour="currentColour"
                :mouse-position="mousePosition"
            />
            <canvas
                ref="image"
                @click="click"
                @mouseover="setMouseAndColour"
                @mousemove="setMouseAndColour"
                @mouseleave="resetMouseAndColour"
            ></canvas>
        </div>
    </div>
</template>

<script>
import ImageColourSwatch from "./ImageColourSwatch.vue";

const defaultMousePosition = { x: 0, y: 0 };

export default {
  name: "ScalableImage",
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
  data: function() {
    return {
      currentColour: "",
      mousePosition: defaultMousePosition
    };
  },
  computed: {
    height() {
      return this.image.height * this.scale;
    },
    width() {
      return this.image.width * this.scale;
    },
    activeClass() {
      return this.canPickColour ? "active" : "";
    }
  },
  methods: {
    drawImage() {
      let canvas = this.$refs.image;
      const drawingContext = this.getDrawingContext();

      canvas.width = this.width;
      canvas.height = this.height;
      drawingContext.scale(this.scale, this.scale);
      drawingContext.drawImage(this.image, 0, 0);
    },
    getDrawingContext() {
      return this.$refs.image.getContext("2d");
    },
    click(event) {
      if (!this.canPickColour) {
        return;
      }
      this.setMouseAndColour(event);
      this.$emit("colour-picked", this.currentColour);
    },
    toHex(v) {
      const s = v.toString(16).toUpperCase();
      return s.length == 1 ? "0" + s : s;
    },
    setMouseAndColour(event) {
      this.setCurrentColour(event);
      this.setMousePosition(event);
    },
    resetMouseAndColour() {
      this.currentColour = "";
      this.mousePosition = defaultMousePosition;
    },
    setCurrentColour(event) {
      const colour = this.getDrawingContext().getImageData(
        event.offsetX,
        event.offsetY,
        1,
        1
      ).data;

      this.currentColour =
        "#" +
        this.toHex(colour[0]) +
        this.toHex(colour[1]) +
        this.toHex(colour[2]);
    },
    setMousePosition(event) {
      this.mousePosition = { x: event.offsetX, y: event.offsetY };
    }
  },
  watch: {
    image() {
      this.resetMouseAndColour();
      this.drawImage();
    },
    scale() {
      this.resetMouseAndColour();
      this.drawImage();
    }
  },
  components: {
    ImageColourSwatch
  }
};
</script>

<style scoped lang="less">
.scalableimage {
  width: 100%;
  height: 100%;
  text-align: center;
  white-space: nowrap;

  &-hackyverticalspacer {
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
    width: 0;
  }
  &-image {
    display: inline-block;
    vertical-align: middle;
    position: relative;

    &--active canvas:hover {
      cursor: crosshair;
    }
  }
}
</style>