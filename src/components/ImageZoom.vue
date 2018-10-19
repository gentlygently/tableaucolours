<template>
    <div class="zoom">
        <a 
            class="button zoomOut fas fa-image" 
            href="#" 
            @click.prevent.stop="zoomOut"></a>
        <input 
            type="range" 
            min="1" 
            max="100" 
            :disabled="!enabled"
            v-model="sliderValue" 
            @mousedown="sliderActive = true" 
            @mouseup="sliderActive = false" 
            class="slider">
        <a 
            class="button zoomIn fas fa-image" 
            href="#" 
            @click.prevent.stop="zoomIn"></a>
        <div class="percentage">{{ percentage }}%</div>
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
  data: function() {
      return {
        sliderValue: 50,
        sliderActive: false
      }
  },
  computed: {
      percentage () {
          return Math.round(100 * this.scale);
      }
  },
  watch: {
      scale (newValue) {
          if (this.sliderActive) {
              return;
          }
          this.sliderValue = newValue < 1
            ? (newValue - this.range.min) * 49 / (1 - this.range.min) + 1
            : (newValue - 1) * 50 / (this.range.max - 1) + 50;
      },
      sliderValue (newValue) {
          const scale = newValue < 50
                ? (newValue - 1) * (1 - this.range.min) / 49 + this.range.min
                : (newValue - 50) * (this.range.max - 1) / 50 + 1;

            this.$emit('zoom', scale);
      }
  },
  methods: {
      input (event, value) {
          this.sliderValue = event.target.value;
      },
      zoomIn () {
          if (this.enabled) {
            this.$emit('zoom', this.scale * 1.1);
          }
      },
      zoomOut () {
          if (this.enabled) {
            this.$emit('zoom', this.scale * 0.9);
          }
      }
  }
}
</script>

<style scoped lang="less">
@import "../variables.less";

div.zoom {
    display: inline-block;
    padding: 0;
    margin: 0;
    line-height: 2rem;
    vertical-align: middle;
    position: relative;
    top: -0.5rem;
}

div.percentage {
    position: absolute;
    top: 1.9rem;
    left: 10.5rem;
    font-size: 0.8rem;
    color: @tool-colour;
    width: 3rem;
    text-align: center;
}

a.zoomIn,
a.zoomOut {
    display: inline-block;
    padding-top: 0.5rem;
    vertical-align: middle;
}

a.zoomOut {
    font-size: 1rem;
    padding-right: 0.5rem;
}

a.zoomIn {
    padding-left: 0.5rem;
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

input[type=range] {
  -webkit-appearance: none;
  width: 20rem;
  margin: 0;
  display: inline-block;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track { .sliderTrack }
  &::-moz-range-track { .sliderTrack }

  &:active::-webkit-slider-runnable-track { .sliderTrackActive }

  &::-webkit-slider-thumb {
    .sliderThumb;
    -webkit-appearance: none;
    margin-top: -0.75rem;
  }
  &::-moz-range-thumb { .sliderThumb }
}

</style>