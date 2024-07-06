<template>
  <div class="extractcolours">
    <div class="extractcolours-fields">
      <div class="extractcolours-field extractcolours-number">
        <label for="numberOfColours" class="extractcolours-numberlabel">Number of colours to extract from image</label>
        <div class="extractcolours-numbercontrol" :class="numberControlClass">
          <button
            class="iconbutton extractcolours-numberstep extractcolours-numberstep--down fas fa-minus"
            :disabled="numberOfColoursToExtract <= 1"
            @click="numberOfColoursToExtract--"
          ></button>
          <input
            id="numberofcolours"
            ref="number"
            v-model="numberOfColoursToExtract"
            type="number"
            min="1"
            :max="maximumColoursToExtract"
            class="extractcolours-numberinput"
            tabindex="100"
            @focus="numberHasFocus = true"
            @blur="numberHasFocus = false"
          />
          <button
            class="iconbutton extractcolours-numberstep extractcolours-numberstep--up fas fa-plus"
            :disabled="numberOfColoursToExtract >= maximumColoursToExtract"
            @click="numberOfColoursToExtract++"
          ></button>
        </div>
      </div>
      <div class="extractcolours-field extractcolours-action">
        <input
          id="replaceColours"
          v-model="action"
          type="radio"
          name="action"
          value="replaceColours"
          class="extractcolours-actioninput"
          tabindex="101"
        />
        <label for="replaceColours" class="extractcolours-actionlabel">
          <span class="extractcolours-radio"></span>Replace existing colours
        </label>
      </div>
      <div class="extractcolours-field extractcolours-action" :class="addColoursClass">
        <input
          id="addColours"
          v-model="action"
          type="radio"
          name="action"
          value="addColours"
          class="extractcolours-actioninput"
          :disabled="!canAddColours"
          tabinex="101"
        />
        <label for="addColours" class="extractcolours-actionlabel" :title="addColoursTitle">
          <span class="extractcolours-radio"></span>Add to existing colours
        </label>
      </div>
    </div>
    <button class="extractcolours-button extractcolours-button--extract" @click="extract">Extract</button>
    <button class="extractcolours-button extractcolours-button--cancel" @click="$emit('close')">Cancel</button>
  </div>
</template>

<script>
import ColorThief from 'colorthief'
import { mapActions, mapState } from 'pinia'
import { usePaletteStore } from '../stores/palette'
import { useImageStore } from '../stores/image'

export default {
  name: 'ExtractColours',
  data: function () {
    return {
      replaceExisting: true,
      numberHasFocus: false,
      numberOfColours: 4,
    }
  },
  computed: {
    ...mapState(usePaletteStore, ['colours', 'maximumColours']),
    ...mapState(usePaletteStore, { canAddColours: 'canAddColour' }),
    ...mapState(useImageStore, ['hasImage', 'image']),

    action: {
      get() {
        return !this.canAddColours || this.replaceExisting ? 'replaceColours' : 'addColours'
      },
      set(newValue) {
        this.replaceExisting = newValue === 'replaceColours'
      },
    },

    addColoursClass() {
      return this.canAddColours ? '' : 'extractcolours-field--disabled'
    },

    addColoursTitle() {
      return this.canAddColours ? '' : 'The colour palette is already full'
    },

    maximumColoursToExtract() {
      return this.action === 'replaceColours' ? this.maximumColours : this.maximumColours - this.colours.length
    },

    numberControlClass() {
      return this.numberHasFocus ? 'extractcolours-numbercontrol--focus' : ''
    },

    numberOfColoursToExtract: {
      get() {
        return this.numberOfColours > this.maximumColoursToExtract ? this.maximumColoursToExtract : this.numberOfColours
      },
      set(newValue) {
        if (newValue > this.maximumColoursToExtract) {
          newValue = this.maximumColoursToExtract
        } else if (newValue < 1) {
          newValue = 1
        }
        this.numberOfColours = newValue
      },
    },
  },

  methods: {
    ...mapActions(usePaletteStore, ['addColours', 'replaceColours']),

    extract() {
      const colours = new ColorThief().getPalette(this.image, this.numberOfColoursToExtract)
      const hexes = colours.map(x => '#' + this.toHex(x[0]) + this.toHex(x[1]) + this.toHex(x[2]))
      switch (this.action) {
        case 'addColours':
          this.addColours(hexes)
          break
        case 'replaceColours':
          this.replaceColours(hexes)
          break
      }
      this.$emit('close')
    },
    toHex(v) {
      const s = v.toString(16).toUpperCase()
      return s.length === 1 ? '0' + s : s
    },
  },
  mounted() {
    this.$refs.number.focus()
  },
}
</script>

<style scoped lang="less">
@import '../variables.less';

.extractcolours {
  color: lighten(#000, 10%);

  &:after {
    content: ' ';
    display: block;
    clear: both;
    width: 0;
    height: 0;
  }

  &-fields {
    font-size: 1.5rem;
    margin-bottom: 1.3rem;
  }

  &-field {
    margin-bottom: 1.5rem;
  }

  &-field--disabled {
    color: @tool-colour-disabled;
  }

  &-numberlabel {
    margin-right: 1rem;
  }

  &-numbercontrol {
    display: inline-block;

    &--focus {
      box-shadow: @box-shadow-active;
    }
  }

  &-numberstep {
    border: @border;
    display: inline-block;
    box-sizing: border-box;
    width: 3rem;
    height: 3rem;
    font-size: 1.5rem;
    line-height: 2.8rem;
    text-align: center;
    overflow: hidden;
  }

  &-numberinput {
    outline: none;
    display: inline-block;
    border: 0;
    border-top: @border;
    border-bottom: @border;
    box-sizing: border-box;
    height: 3rem;
    width: 4rem;
    text-align: center;
    font-size: 1.5rem;
    overflow: hidden;
    vertical-align: middle;
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
  }

  &-action {
    margin-bottom: 0.8rem;
  }

  &-actioninput {
    position: absolute;
    opacity: 0;
  }

  &-actionlabel {
    position: relative;
    display: inline-block;
    line-height: 1.8rem;
    vertical-align: middle;
  }

  &-radio {
    &:before {
      position: relative;
      display: inline-block;
      border: @border;
      border-radius: 50%;
      width: 1.8rem;
      height: 1.8rem;
      box-sizing: border-box;
      margin-right: 0.7rem;
      content: '';
      vertical-align: middle;
      top: -0.2rem;
    }

    &:hover:before {
      border-color: @tool-colour-active;
    }
  }

  &-actioninput:checked + &-actionlabel &-radio:before {
    background-color: @tool-colour-active;
    border-color: @tool-colour-active;
  }

  &-actioninput:focus + &-actionlabel &-radio:before {
    box-shadow: @box-shadow-active;
  }

  &-actioninput:checked + &-actionlabel &-radio:after {
    position: absolute;
    display: inline-block;
    background-color: #fff;
    border-radius: 50%;
    width: 0.8rem;
    height: 0.8rem;
    box-sizing: border-box;
    content: '';
    vertical-align: middle;
    top: 0.4rem;
    left: 0.5rem;
  }

  &-field--disabled &-radio {
    &:before {
      border-color: @border-colour;
    }

    &:hover:before {
      border-color: @border-colour;
    }
  }

  &-button {
    border: none;
    outline: none;
    padding: 0.5rem;
    font-size: 1.5rem;
    color: #fff;
    background-color: @button-colour;
    text-align: center;
    width: 15rem;
    float: right;
    margin-top: 1rem;
    margin-left: 1rem;

    &:hover {
      background-color: @button-colour-hover;
    }

    &:disabled {
      background-color: @button-colour-disabled;
    }
  }
}
</style>
