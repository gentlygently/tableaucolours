<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  scale: { type: Number, required: true },
  range: { type: Object, required: true },
  enabled: Boolean,
})

const emit = defineEmits(['zoom'])

const scale = computed(() => props.scale)
const sliderValue = ref(50)
const sliderActive = ref(false)
const percentage = computed(() => Math.round(100 * props.scale))

function zoomIn() {
  if (props.enabled) {
    emit('zoom', props.scale * 1.1)
  }
}

function zoomOut() {
  if (props.enabled) {
    emit('zoom', props.scale * 0.9)
  }
}

watch(scale, newValue => {
  if (sliderActive.value) {
    return
  }
  sliderValue.value =
    newValue < 1
      ? ((newValue - props.range.min) * 49) / (1 - props.range.min) + 1
      : ((newValue - 1) * 50) / (props.range.max - 1) + 50
})

watch(sliderValue, newValue => {
  const value =
    newValue < 50
      ? ((newValue - 1) * (1 - props.range.min)) / 49 + props.range.min
      : ((newValue - 50) * (props.range.max - 1)) / 50 + 1

  emit('zoom', value)
})
</script>

<template>
  <div class="imagezoom">
    <button
      class="iconbutton imagezoom-out fas fa-image"
      title="Zoom out (Shift + Scroll-down)"
      :disabled="!props.enabled"
      @click.prevent.stop="zoomOut"
    ></button>
    <input
      v-model="sliderValue"
      type="range"
      min="1"
      max="100"
      :disabled="!props.enabled"
      class="imagezoom-slider"
      @mousedown="sliderActive = true"
      @mouseup="sliderActive = false"
    />
    <button
      class="iconbutton imagezoom-in fas fa-image"
      title="Zoom in (Shift + Scroll-up)"
      :disabled="!props.enabled"
      @click.prevent.stop="zoomIn"
    ></button>
    <div class="imagezoom-percentage">{{ percentage }}%</div>
  </div>
</template>

<style scoped lang="less">
@import '../../variables.less';

.imagezoom {
  display: inline-block;
  padding: 0;
  margin: 0;
  line-height: 2rem;
  vertical-align: middle;
  position: relative;
  top: -0.5rem;

  &-percentage {
    position: absolute;
    top: 2.2rem;
    left: 10.5rem;
    font-size: 0.8rem;
    color: @tool-colour;
    width: 3rem;
    text-align: center;
  }

  &-in,
  &-out {
    display: inline-block;
    padding-top: 0.5rem;
    vertical-align: middle;
    line-height: 2.9rem;
  }

  &-out {
    font-size: 1rem;
    padding-right: 0.5rem;
    padding-left: 0.5rem;
  }

  &-in {
    padding-left: 0.5rem;
    font-size: 2rem;
  }

  .sliderTrack {
    width: 100%;
    height: 0.2rem;
    cursor: pointer;
    box-shadow:
      0 0 0.1rem #000000,
      0 0 0 #0d0d0d;
    background: @tool-colour;
    border-radius: 0;
    border: 0;
  }

  .sliderTrackActive {
    background: @tool-colour-active;
  }

  .sliderTrackDisabled {
    background: @tool-colour-disabled;
  }

  .sliderThumb {
    box-shadow: none;
    border: solid 0.1rem @tool-colour;
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
  }

  &-slider {
    -webkit-appearance: none;
    width: 20rem;
    margin: 0;
    display: inline-block;

    &:focus {
      outline: none;
    }

    &::-webkit-slider-runnable-track {
      .sliderTrack;
    }
    &::-moz-range-track {
      .sliderTrack;
    }

    &::-webkit-slider-runnable-track:active {
      .sliderTrackActive;
    }
    &::-moz-range-track:active {
      .sliderTrackActive;
    }

    &:disabled::-webkit-slider-runnable-track {
      .sliderTrackDisabled;
    }
    &:disabled::-moz-range-track {
      .sliderTrackDisabled;
    }

    &::-webkit-slider-thumb {
      .sliderThumb;
      -webkit-appearance: none;
      margin-top: -0.75rem;
    }
    &::-moz-range-thumb {
      .sliderThumb;
    }
  }
}
</style>
