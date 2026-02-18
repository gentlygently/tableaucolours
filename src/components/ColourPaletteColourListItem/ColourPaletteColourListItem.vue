<script setup>
import { computed, ref } from 'vue'
import ColourPicker from '../ColourPicker/ColourPicker.vue'
import { usePaletteStore } from '@/stores/palette'

const store = usePaletteStore()

const props = defineProps({
  colour: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  draggingActive: Boolean,
})

const colour = ref(props.colour)
const isPickerOpen = ref(false)

const containerClasses = computed(() => {
  const classes = []
  if (colour.value.isSelected) classes.push('colour--selected')
  if (isPickerOpen.value) classes.push('colour--pickeropen')
  if (props.draggingActive) classes.push('colour--dragging')
  return classes
})

const column = computed(() => Math.floor(props.index / 5) + 1)
const row = computed(() => (props.index % 5) + 1)

function click() {
  store.selectColour(colour.value)
}

function colourPicked(hex) {
  store.updateColour(colour.value, hex)
}

function remove() {
  store.removeColour(colour.value)
}
</script>

<template>
  <li
    class="colour"
    :class="containerClasses"
    :title="colour.hex + ' (double click to edit)'"
    :style="{ 'grid-column': column, 'grid-row': row }"
    @click="click"
  >
    <div
      class="colour-swatch"
      :style="{ 'background-color': colour.hex }"
      @dblclick="isPickerOpen = true"
    ></div>
    <div class="colour-remove" title="Delete colour (Delete)" @click.prevent.stop="remove">
      <span class="fas fa-times"></span>
    </div>
    <colour-picker
      v-if="isPickerOpen"
      class="colour-picker"
      :hex="colour.hex"
      @colour-picked="colourPicked"
      @done="isPickerOpen = false"
    />
  </li>
</template>

<style scoped lang="less">
@import '../../variables.less';

.colour {
  display: block;
  box-sizing: border-box;
  width: 5rem;
  height: 5rem;
  padding: 0.5rem;
  list-style: none;
  background-color: #fff;
  border-radius: 0.2rem;
  /*box-shadow: 0rem 0rem 0.2rem 0.2rem @border-colour;*/
  position: relative;

  &:hover {
    box-shadow: 0rem 0rem 0.2rem 0.2rem @border-colour;
  }

  &--selected,
  &--selected:hover {
    box-shadow: 0rem 0rem 0.2rem 0.2rem @border-colour-active;
  }

  &:hover .colour-remove {
    display: block;
  }

  .colourlist-colour--drag .colour-remove,
  .colourlist-colour--drag:hover .colour-remove,
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
    padding-top: 0.1rem;
    color: #fff;
    background-color: #e94544;
    box-sizing: border-box;
    box-shadow: 0rem 0rem 0.1rem 0.1rem #fff;
    z-index: 1;
  }

  &-picker {
    display: block;
    position: absolute;
    z-index: 2000;
    top: 0.5rem;
    left: 4.5rem;
    width: 20rem;
    box-sizing: border-box;
    box-shadow: @box-shadow;
    background-color: #fff;
  }
}
</style>
