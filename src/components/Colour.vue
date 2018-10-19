<template>
    <li :class="activeClass" @click="click">
        <colour-swatch :colour="colour.colour" class="swatch" />
        <colour-picker :colour="colour.colour" class="picker" />
        <span @click.prevent.stop="remove" class="remove fas fa-times" title="Delete colour"></span>
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
  computed: {
      activeClass () {
          return this.colour.isSelected ? 'active' : '';
      }
  },
  components: {
    ColourPicker,
    ColourSwatch
  },
  methods: {
      click () {
          this.$emit('select', this.colour);
      },
      remove () {
          this.$emit('remove', this.colour);
      }
  }
}
</script>

<style scoped lang="less">
li {
    border-bottom: solid 1px #d8d5d3;
    padding: 0.5rem 1rem 0.5rem 1.5rem;
    margin: 0;
    list-style: none;
    line-height: 3.5rem;

    &.active {
        background-color: #d7d5d3;
        border-color: #c7c5c3;
    }
    &:hover .remove {
        display: block;
    }
}
.swatch {
    display: inline-block;
    width: 3.5rem;
    height: 3.5rem;
    box-sizing: border-box;
}
.picker {
    display: inline-block;
    margin-left: 1rem;
}
.remove {
    display: none;
    float: right;
    width: 1.5rem;
    font-size: 2rem;
    line-height: 3.5rem;
    color: #73716f;
}
</style>