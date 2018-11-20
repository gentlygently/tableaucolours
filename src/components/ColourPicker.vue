<template>
  <div class="colourpicker" @keyup.enter="done" @click.stop.prevent>
    <sketch-colour-picker
      :disable-alpha="true"
      :value="hex"
      @input="colourPicked"
      :presetColors="[]"
    />
    <div class="colourpicker-buttons">
      <button class="colourpicker-done" @click.stop.prevent="done">Done</button>
    </div>
  </div>
</template>

<script>
import { Sketch } from 'vue-color'

export default {
  name: 'ColourPIcker',
  props: {
    hex: {
      type: String,
      required: true
    }
  },
  components: {
    'sketch-colour-picker': Sketch
  },
  methods: {
    colourPicked (value) {
      if (value && value.hex) {
        this.$emit('colour-picked', value.hex)
      }
    },
    done () {
      this.$emit('done')
    }
  },
  created () {
    window.addEventListener('click', this.done, false)
  },
  destroyed () {
    window.removeEventListener('click', this.done)
  }
}
</script>

<style lang="less">
@import '../variables.less';

.colourpicker {
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

.vc-sketch,
.vc-sketch.vc-sketch__disable-alpha {
  padding: 0 !important;
  box-sizing: border-box !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  width: 100% !important;
}
.vc-sketch-sliders {
  padding: 0.5rem 1rem !important;
}
.vc-sketch-hue-wrap {
  height: 0.6rem !important;
  margin-top: 0.3rem;
}
.vc-sketch-presets,
.vc-sketch-color-wrap {
  display: none;
}
.vc-sketch-field {
  padding: 0.5rem 1rem !important;
}
.vc-hue {
  border-radius: 0.2rem !important;

  &-container {
    margin: 0 0.2rem !important;
  }

  &-picker {
    width: 1.5rem !important;
    height: 1.5rem !important;
    border-radius: 50% !important;
    transform: translate(-0.75rem, -0.45rem) !important;
    margin: 0 !important;
    box-sizing: border-box !important;
    box-shadow: 0 0 0.2rem rgba(0, 0, 0, 0.6) !important;
  }
}
.vc-input__label {
  color: @tool-colour !important;
  padding: 0.3rem 0 0 0 !important;
  font-size: 1.1rem !important;
}
.vc-input__input {
  padding: 0.4rem !important;
  border: @border !important;
  border-radius: 0.2rem !important;
  box-shadow: none !important;
  font-size: 1rem !important;
  box-sizing: border-box !important;
  width: 100% !important;
  text-align: center !important;
}
</style>
