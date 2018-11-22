<template>
  <div class="imagezoom">
    <button class="iconbutton imagezoom-out fas fa-image" @click.prevent.stop="zoomOut"></button>
    <input
      type="range"
      min="1"
      max="100"
      :disabled="!enabled"
      v-model="sliderValue"
      @mousedown="sliderActive = true"
      @mouseup="sliderActive = false"
      class="imagezoom-slider"
    >
    <button class="iconbutton imagezoom-in fas fa-image" @click.prevent.stop="zoomIn"></button>
    <div class="imagezoom-percentage">{{ percentage }}%</div>
  </div>
</template>

<script>
export default {
  name: 'ImageZoom',
  props: {
    scale: Number,
    range: Object,
    enabled: Boolean
  },
  data: function () {
    return {
      sliderValue: 50,
      sliderActive: false
    }
  },
  computed: {
    percentage () {
      return Math.round(100 * this.scale)
    }
  },
  watch: {
    scale (newValue) {
      if (this.sliderActive) {
        return
      }
      this.sliderValue =
        newValue < 1
          ? ((newValue - this.range.min) * 49) / (1 - this.range.min) + 1
          : ((newValue - 1) * 50) / (this.range.max - 1) + 50
    },
    sliderValue (newValue) {
      const scale =
        newValue < 50
          ? ((newValue - 1) * (1 - this.range.min)) / 49 + this.range.min
          : ((newValue - 50) * (this.range.max - 1)) / 50 + 1

      this.$emit('zoom', scale)
    }
  },
  methods: {
    input (event, value) {
      this.sliderValue = event.target.value
    },
    zoomIn () {
      if (this.enabled) {
        this.$emit('zoom', this.scale * 1.1)
      }
    },
    zoomOut () {
      if (this.enabled) {
        this.$emit('zoom', this.scale * 0.9)
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '../variables.less';

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
    box-shadow: 0 0 0.1rem #000000, 0 0 0 #0d0d0d;
    background: @tool-colour;
    border-radius: 0;
    border: 0;
  }

  .sliderTrackActive {
    background: @tool-colour-active;
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

    &:active::-webkit-slider-runnable-track {
      .sliderTrackActive;
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
