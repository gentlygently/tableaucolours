<template>
    <div class="swatch" v-bind:style="swatchStyle">&nbsp;</div>
</template>

<script>
export default {
  name: 'ImageColourSwatch',
  props: {
    colour: {
        type: String,
        required: true
    },
    mousePosition: {
        type: Object,
        required: true
    }
  },
  computed: {
      swatchStyle () {
          return {
              'background-color': this.colour,
              top: (this.mousePosition.y - 40) + 'px',
              left: (this.mousePosition.x + 10) + 'px'
          }
      }
  }
}
</script>

<style scoped lang="less">
div.swatch {
    display: block;
    position: absolute;
    width: 4rem;
    height: 4rem;
    border: solid 0.1rem #d8d5d3;
    border-radius: 50%;
}
</style>