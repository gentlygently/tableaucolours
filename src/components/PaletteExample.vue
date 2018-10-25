<template>
  <div class="paletteexample" :style="{ background: backgroundStyle }">&nbsp;</div>
</template>

<script>
export default {
  name: 'PaletteExample',
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
            .map(
              x =>
                `${x.colour} ${position}%, ${x.colour} ${(position += width)}%`
            )
            .join(', ')})`

        case 'ordered-sequential':
          return `linear-gradient(to right, ${this.palette.colours
            .map(x => x.colour)
            .join(', ')})`

        case 'ordered-diverging':
          return `linear-gradient(to left, ${this.palette.colours
            .map(x => x.colour)
            .join(', ')})`
      }
      return ''
    }
  }
}
</script>

<style scoped lang="less">
@import '../variables.less';

.paletteexample {
  height: 3rem;
  border-radius: 0.2rem;
  box-sizing: border-box;
  box-shadow: 0rem 0rem 0.2rem 0.2rem @border-colour;
}
</style>
