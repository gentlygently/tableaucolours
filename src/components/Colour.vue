<template>
  <li
    class="colour"
    :class="containerClasses"
    @click="click"
    :title="colour.hex + ' (double click to edit)'"
    :style="{ 'grid-column': column, 'grid-row': row }"
  >
    <div
      class="colour-swatch"
      :style="{ 'background-color': colour.hex }"
      @dblclick="isPickerOpen=true"
    ></div>
    <div class="colour-remove" @click.prevent.stop="remove" title="Delete colour (Delete)">
      <span class="fas fa-times"></span>
    </div>
    <colour-picker
      v-if="isPickerOpen"
      class="colour-picker"
      :hex="colour.hex"
      @colour-picked="colourPicked"
      @done="isPickerOpen=false"
    />
  </li>
</template>

<script>
import ColourPicker from './ColourPicker.vue'

export default {
  name: 'Colour',
  props: {
    colour: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      isPickerOpen: false
    }
  },
  components: {
    ColourPicker
  },
  computed: {
    containerClasses () {
      let classes = []
      if (this.colour.isSelected) classes.push('colour--selected')
      if (this.isPickerOpen) classes.push('colour--pickeropen')
      return classes
    },
    column () {
      return Math.floor(this.index / 5) + 1
    },
    row () {
      return (this.index % 5) + 1
    }
  },
  methods: {
    click () {
      this.$store.commit('palette/selectColour', { colour: this.colour })
    },
    colourPicked (hex) {
      this.$store.commit('palette/updateColour', { colour: this.colour, hex })
    },
    remove () {
      this.$store.commit('palette/removeColour', { colour: this.colour })
    }
  }
}
</script>

<style scoped lang="less">
@import '../variables.less';

.colour {
  display: block;
  box-sizing: border-box;
  width: 5rem;
  height: 5rem;
  padding: 0.5rem;
  list-style: none;
  background-color: #fff;
  border-radius: 0.2rem;
  box-shadow: 0rem 0rem 0.2rem 0.2rem @border-colour;
  position: relative;

  &:hover {
    box-shadow: 0rem 0rem 0.2rem 0.2rem @border-colour-hover;
  }

  &--selected,
  &--selected:hover {
    box-shadow: 0rem 0rem 0.2rem 0.2rem @border-colour-active;
  }

  &:hover .colour-remove {
    display: block;
  }

  &--dragging .colour-remove,
  &--dragging:hover .colour-remove,
  &--pickeropen .colour-remove,
  &--pickeropen:hover .colour-remove {
    display: none;
  }

  &-swatch {
    border: @border;
    border-radius: 0.2rem;
    height: 100%;
    box-sizing: border-box;
  }

  &-remove {
    display: none;
    position: absolute;
    top: -0.75rem;
    right: -0.75rem;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    font-size: 1.5rem;
    line-height: 1.9rem;
    text-align: center;
    padding-left: 0.1rem;
    color: #fff;
    background-color: #e94544;
    box-sizing: border-box;
    box-shadow: 0rem 0rem 0.1rem 0.1rem #fff;
    z-index: 1;
  }

  &-picker {
    display: block;
    position: absolute;
    z-index: 2;
    top: 0.5rem;
    left: 4.5rem;
    width: 20rem;
    box-sizing: border-box;
    box-shadow: @box-shadow;
    background-color: #fff;
  }
}
</style>
