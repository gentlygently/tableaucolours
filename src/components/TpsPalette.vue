<script setup>
import { computed } from 'vue'
import PalettePreview from './PalettePreview.vue'
import { PaletteTypes } from '../PaletteTypes'

const props = defineProps({
  palette: {
    type: Object,
    required: true,
  },
})

const typeName = computed(() => {
  const type = PaletteTypes.get(props.palette.type)
  return type ? type.name : props.palette.type
})

const tooltip = computed(() => `${props.palette.name}\r\n${typeName.value}\r\n(double click to edit)`)

const emit = defineEmits(['selected'])

const click = () => emit('selected', props.palette)
</script>

<template>
  <li class="palette" :title="tooltip" :class="{ 'palette--selected': palette.isSelected }" @click="click">
    <div class="details">
      {{ palette.name }}
      <div class="preview"><PalettePreview :type="palette.type" :colours="palette.colours" /></div>
    </div>
    <div class="actions">
      <button class="iconbutton fas fa-ellipsis-h" title=""></button>
    </div>
  </li>
</template>

<style scoped lang="less">
@import '../variables.less';

.palette {
  display: grid;
  grid-template-columns: auto 2.5rem;
  grid-template-rows: auto;
  box-sizing: border-box;
  height: 5rem;
  padding: 0.75rem;
  padding-top: 0.4rem;
  list-style: none;
  background-color: @background-colour;
  border-bottom: @border;
  position: relative;
  font-size: 1.4rem;

  &:hover {
    background-color: @background-colour-hover;
  }

  &--selected,
  &--selected:hover {
    box-shadow: inset 0rem 0rem 0.2rem 0.2rem @border-colour-active;
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
    z-index: 2;
    top: 0.5rem;
    left: 4.5rem;
    width: 20rem;
    box-sizing: border-box;
    box-shadow: @box-shadow;
    background-color: #fff;
  }
}
.details {
  grid-column: 1 / span 1;
  grid-row: 1 / span 1;
}
.actions {
  grid-column: 2 / span 1;
  grid-row: 1 / span 1;
  padding-left: 1rem;

  > button {
    font-size: 1rem;
    vertical-align: middle;
    position: relative;
    padding: 0.5rem;
    padding-top: 0;
    top: -0.3rem;
  }
}
.preview {
  height: 1.5rem;
  margin-top: 0.2rem;
}
</style>
