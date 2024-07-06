<template>
  <div class="palettepreview" :style="{ background: backgroundStyle }">&nbsp;</div>
</template>

<script>
export default {
  name: 'PalettePreview',
  props: {
    type: {
      type: String,
      required: true,
    },
    colours: {
      type: Array,
      required: true,
    },
  },
  computed: {
    backgroundStyle() {
      function regular(colours) {
        const width = 100 / colours.length
        let position = 0
        return `linear-gradient(to right, ${colours
          .map(x => `${x.hex} ${position}%, ${x.hex} ${(position += width)}%`)
          .join(', ')})`
      }
      switch (this.type) {
        case 'regular':
          return regular(this.colours)

        case 'ordered-diverging':
        case 'ordered-sequential':
          return `linear-gradient(to right, ${this.colours.map(x => x.hex).join(', ')})`
      }
      return ''
    },
  },
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
