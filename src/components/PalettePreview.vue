<template>
  <div class="palettepreview" :style="{ background: backgroundStyle }">&nbsp;</div>
</template>

<script>
export default {
  name: 'PalettePreview',
  props: {
    palette: {
      type: Object,
      required: true
    }
  },
  computed: {
    backgroundStyle () {
      switch (this.palette.type) {
        case 'regular':
          const width = 100 / this.palette.colours.length
          let position = 0
          return `linear-gradient(to right, ${this.palette.colours
            .map(x => `${x.hex} ${position}%, ${x.hex} ${(position += width)}%`)
            .join(', ')})`

        case 'ordered-diverging':
        case 'ordered-sequential':
          return `linear-gradient(to right, ${this.palette.colours
            .map(x => x.hex)
            .join(', ')})`
      }
      return ''
    }
  }
}
</script>

<style scoped lang="less">
@import '../variables.less';

.palettepreview {
  height: 3rem;
  border-radius: 0.2rem;
  box-sizing: border-box;
  box-shadow: 0rem 0rem 0.2rem 0.2rem @border-colour;
}
</style>
