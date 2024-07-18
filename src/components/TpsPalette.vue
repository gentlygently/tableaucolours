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

const emit = defineEmits(['delete', 'clone'])

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

const isPaletteSelected = computed(() => props.palette.isCurrent)

const scrollIntoViewIfCurrent = isCurrent => {
  if (isCurrent) element.value.scrollIntoView({ block: 'nearest' })
}

onMounted(() => scrollIntoViewIfCurrent(props.palette.isCurrent))

watch(isPaletteSelected, newValue => scrollIntoViewIfCurrent(newValue), { flush: 'post' })

const deleteClick = () => emit('delete', props.palette)
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
    <div class="drag" v-if="canMove">
      <span class="fas fa-ellipsis-v"></span>
    </div>
    <div class="more">
      <button class="more-toggle" :title="showMore ? 'Less' : 'More'" @click.stop.prevent="moreClick">...</button>
    </div>
    <ul class="actions" style="display: none">
      <li>
        <button class="actions-clone" title="Clone palette" @click.stop.prevent="cloneClick">
          <span class="fas fa-clone"></span><
        </button>
      </li>
      <li>
        <button class="actions-delete" title="Delete palette" @click.stop.prevent="deleteClick">
          <span class="fas fa-trash-alt"></span>
        </button>
      </li>
    </ul>
  </li>
</template>

<style scoped lang="less">
@import '../variables.less';

.palette {
  display: grid;
  position: relative;
  grid-template-columns: auto 2rem;
  grid-template-rows: auto auto;
  box-sizing: border-box;
  margin: 0.75rem;
  padding: 1rem;
  padding-top: 0.4rem;

  background-color: #fff;
  border-radius: 0.5rem;

  font-size: 1.4rem;

  &--current {
    box-shadow: inset 0rem 0rem 0.1rem 0.1rem @border-colour-active;
  }

  &--changed .name {
    font-weight: bold;
  }

  &--more {
    left: -2.5rem;
  }

  &--more-enter {
    left: -2.5rem;
    animation: slide-in 0.3s;
  }

  &--more-leave {
    left: 0;
    animation: slide-in 0.3s reverse;
  }

  .name {
    grid-column: 1 / span 1;
    grid-row: 1 / span 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .preview {
    grid-column: 1 / span 1;
    grid-row: 2 / span 1;
    height: 1.5rem;
    width: 100%;
    margin-top: 0.4rem;
  }

  .drag {
    grid-column: 2 / span 1;
    grid-row: 1 / span 2;
    text-align: right;
    color: @tool-colour;
    background-color: #fff;
    padding-top: 1.2rem;
    margin-left: 0.5rem;
    margin-right: 0.2rem;

    &:hover {
      color: @tool-colour-hover;
      cursor: move;
    }
  }

  .more {
    display: none;
    grid-column: 2 / span 1;
    grid-row: 1 / span 1;
  }

  .more-toggle {
    display: block;
    float: right;
    box-sizing: border-box;
    width: 1.5rem;
    height: 1.5rem;
    border: 0;
    border-radius: 50%;
    outline: none;
    font-weight: bold;
    font-size: 1rem;
    line-height: 0.5rem;
    text-align: center;
    padding: 0;
    padding-bottom: 0.5rem;
    margin: 0;
    color: #fff;
    background-color: @tool-colour-disabled;

    &:hover {
      background-color: @tool-colour;
    }
  }

  &--more .more-toggle {
    background-color: @button-colour;

    &:hover {
      background-color: @button-colour-hover;
    }
  }

  .actions {
    display: block;
    position: absolute;
    top: 0;
    right: -2.5rem;
    width: 2.5rem;
    height: 5rem;
    margin: 0;
    padding: 0;
    list-style: none;
    border-bottom: @border;

    button {
      display: block;
      width: 100%;
      height: 2.5rem;
      border: 0;
      margin: 0;
      outline: 0;
      text-align: center;
      color: #fff;
      line-height: 2.2rem;
    }

    &-clone {
      background-color: orange;

      &:hover {
        background-color: lighten(orange, 10%);
      }
    }

    &-delete {
      background-color: red;

      &:hover {
        background-color: lighten(red, 15%);
      }
    }
  }
}
@keyframes slide-in {
  0% {
    left: 0;
  }
  100% {
    left: -2.5rem;
  }
}
</style>
