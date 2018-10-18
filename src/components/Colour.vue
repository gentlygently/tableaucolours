<template>
    <li>
        <colour-swatch :colour="colour.colour" class="swatch" />
        <colour-picker :colour="colour.colour" class="picker" />
    </li>
</template>

<script>
import ColourPicker from './ColourPicker.vue'
import ColourSwatch from './ColourSwatch.vue'

export default {
  name: 'Colour',
  props: {
    colour: {
        type: Object,
        required: true
    }
  },
  components: {
    ColourPicker,
    ColourSwatch
  }
}
</script>

<style scoped lang="less">
li {
    border: solid 1px #ccc;
    padding: 1rem;
    margin: 0;
    list-style: none;
    line-height: 4rem;
}
.swatch {
    display: inline-block;
    width: 4rem;
    height: 4rem;
    box-sizing: border-box;
}
.picker {
    display: inline-block;
    margin-left: 1rem;
}
</style>