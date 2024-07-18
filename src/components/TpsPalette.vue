<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import PalettePreview from './PalettePreview.vue'
import { PaletteTypes } from '../PaletteTypes'

const props = defineProps({
  palette: {
    type: Object,
    required: true,
  },
  canMove: Boolean,
})

const emit = defineEmits(['clone'])

const element = ref(null)

const typeName = computed(() => {
  const type = PaletteTypes.get(props.palette.type)
  return type ? type.name : props.palette.type
})

const tooltip = computed(() => `${props.palette.name}\r\n${typeName.value}\r\n(double click to edit)`)

const showMore = ref(false)
const moreClasses = ref([])

function moreClick() {
  if (showMore.value) {
    moreClasses.value = ['palette--more-leave']
    showMore.value = false
  } else {
    moreClasses.value = ['palette--more', 'palette--more-enter']
    showMore.value = true
  }
}

// Remove the animation classes when the animation completes (otherwise the animation only works once)
function animated() {
  moreClasses.value = moreClasses.value.filter(x => x === 'palette--more')
}

const isCurrentPalette = computed(() => props.palette.isCurrent)
const hasPaletteMovied = computed(() => props.palette.moved)

const scrollIntoViewIfCurrent = isCurrent => {
  if (isCurrent) element.value.scrollIntoView({ block: 'nearest' })
}

onMounted(() => scrollIntoViewIfCurrent(props.palette.isCurrent))

watch(isCurrentPalette, newValue => scrollIntoViewIfCurrent(newValue), { flush: 'post' })
watch(hasPaletteMovied, () => scrollIntoViewIfCurrent(props.palette.isCurrent), { flush: 'post' })

const cloneClick = () => {
  moreClick()
  emit('clone', props.palette)
}
</script>

<template>
  <li
    ref="element"
    class="palette"
    :title="tooltip"
    :class="[
      {
        'palette--current': palette.isCurrent,
        'palette--changed': palette.hasChanges,
      },
      ...moreClasses,
    ]"
    @animationend="animated"
  >
    <div class="name">
      {{ palette.name }}
    </div>
    <div class="preview"><PalettePreview :type="palette.type" :colours="palette.colours" /></div>
    <div class="select">
      <input type="checkbox" v-model="palette.isSelected" title="Select palette" @click.stop />
    </div>
    <div class="clone" title="">
      <button class="iconbutton fas fa-plus" title="Clone palette" @click.stop.prevent="cloneClick"></button>
    </div>
    <div class="drag" title="" v-if="canMove">
      <span class="fas fa-ellipsis-v"></span>
    </div>
  </li>
</template>

<style scoped lang="less">
@import '../variables.less';

.palette {
  display: grid;
  position: relative;
  grid-template-columns: 4.5rem auto 3.1rem 2.7rem;
  grid-template-rows: auto auto;
  box-sizing: border-box;
  margin: 0.75rem;
  padding: 0.4rem 0.5rem 1rem 0;
  background-color: #fff;
  border-radius: 0.5rem;
  font-size: 1.4rem;

  &--current {
    box-shadow: inset 0rem 0rem 0.1rem 0.1rem @border-colour-active;
  }

  &--changed .name {
    font-weight: bold;
  }

  .name {
    grid-column: 2 / span 1;
    grid-row: 1 / span 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .preview {
    grid-column: 2 / span 1;
    grid-row: 2 / span 1;
    height: 1.5rem;
    width: 100%;
    margin-top: 0.4rem;
  }

  .select {
    grid-column: 1 / span 1;
    grid-row: 1 / span 2;
    display: grid;
    place-content: center;
    padding-top: 0.6rem;

    input[type='checkbox'] {
      appearance: none;
      background-color: #fff;
      margin: 0;
      width: 2rem;
      height: 2rem;
      border: @border;
      border-radius: 1em;
      display: grid;
      place-content: center;

      &:hover {
        box-shadow: inset 0rem 0rem 0.1rem 0.1rem @border-colour;
      }

      &::before {
        content: '';
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 0.6rem;
        transform: scale(0);
        transition: 120ms transform ease-in-out;
        background-color: @button-colour;
      }

      &:checked::before {
        transform: scale(1);
      }

      &:checked:hover::before {
        background-color: @button-colour-hover;
      }
    }
  }

  .clone {
    grid-column: 3 / span 1;
    grid-row: 1 / span 2;
    display: grid;
    place-content: center;
    margin-left: 1.7rem;
    margin-top: 0.8rem;

    .iconbutton {
      font-size: 1.5rem;
      color: lighten(@tool-colour, 10%);

      &:hover {
        color: @tool-colour-hover;
      }
    }
  }

  .drag {
    grid-column: 4 / span 1;
    grid-row: 1 / span 2;
    display: grid;
    place-content: center;
    color: @tool-colour-disabled;
    background-color: #fff;
    margin: 1.2rem 0.2rem 0.5rem 0.7rem;
    padding: 0.3rem 0.2rem 0.3rem 0.1rem;
    padding-left: 0.5rem;
    border-left: @border;
    box-sizing: border-box;

    &:hover {
      color: @tool-colour-hover;
      cursor: move;
    }
  }
}
</style>
