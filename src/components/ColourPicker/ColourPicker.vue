<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import SketchColourPicker from './SketchColourPicker.vue'
import { ColourPickerTestIds } from './ColourPickerTestIds'

const props = defineProps({
  hex: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['colour-picked', 'done'])

const colour = ref({ hex: props.hex })

function done(e) {
  emit('done')
}

watch(colour, newValue => {
  if (newValue.hex) {
    emit('colour-picked', newValue.hex)
  }
})

onMounted(() => window.addEventListener('click', done, false))

onUnmounted(() => window.removeEventListener('click', done))
</script>

<template>
  <div
    class="colourpicker"
    :data-testid="ColourPickerTestIds.Self"
    @keyup.enter="done"
    @click.stop.prevent
    @pointerdown.stop
    @mousedown.stop
  >
    <SketchColourPicker v-model="colour" />
    <div class="colourpicker-buttons">
      <button class="colourpicker-done" @click.stop.prevent="done">Done</button>
    </div>
  </div>
</template>

<style lang="less">
@import '../../variables.less';

.colourpicker {
  background-color: @background-colour;

  &-buttons {
    margin: 0.5rem 1rem 1rem 1rem;
  }

  &-done {
    display: block;
    border: none;
    outline: none;
    padding: 0.5rem;
    font-size: 1.5rem;
    color: #fff;
    background-color: @button-colour;
    text-align: center;
    width: 100%;
    box-sizing: border-box;

    &:hover {
      background-color: @button-colour-hover;
    }

    &--copied {
      background-color: @button-special-colour;

      &:hover {
        background-color: @button-special-colour-hover;
      }
    }
  }
}
</style>
