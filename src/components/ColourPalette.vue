<template>
  <div class="colourpalette">
    <div class="colourpalette-name">
      <input type="text" id="name" v-model="palette.name" placeholder="Enter a palette name">
    </div>
    <div class="colourpalette-type">
      <palette-types :selected-type="palette.type" @type-selected="typeSelected"/>
    </div>
    <colour-list
      :colours="palette.colours"
      @select-colour="selectColour"
      @remove-colour="removeColour"
    />
    <ul class="colourpalette-actions">
      <!-- TODO: Put these in a separate component? -->
      <li class="import">
        <button
          @click.prevent.stop="importModalOpen = true"
          class="icon-button fas fa-file-import"
          title="Import XML"
        ></button>
      </li>
      <li class="code">
        <button
          @click.prevent.stop="codeModalOpen = true"
          class="icon-button fas fa-code"
          title="Get code"
        ></button>
      </li>
      <li class="discard">
        <button
          @click.prevent.stop="discard"
          class="icon-button fas fa-trash-alt"
          title="Delete palette"
        ></button>
      </li>
      <li class="add">
        <button @click.prevent.stop="add" class="icon-button fas fa-plus" title="Add colour"></button>
      </li>
    </ul>
    <modal v-if="codeModalOpen" width="54rem" @close="codeModalOpen = false">
      <get-code :palette="palette"/>
    </modal>
    <modal v-if="importModalOpen" width="54rem" @close="importModalOpen = false">
      <import-code @import-palette="importPalette" @close="importModalOpen = false"/>
    </modal>
  </div>
</template>

<script>
import ColourList from './ColourList.vue'
import GetCode from './GetCode.vue'
import ImportCode from './ImportCode.vue'
import Modal from './Modal.vue'
import PaletteTypes from './PaletteTypes.vue'

export default {
  name: 'ColourPalette',
  props: {
    palette: {
      type: Object,
      required: true
    }
  },
  data: function () {
    return {
      codeModalOpen: false,
      importModalOpen: false
    }
  },
  computed: {
    selectedColourIndex () {
      return this.palette.colours.findIndex(x => x.isSelected)
    }
  },
  components: {
    ColourList,
    GetCode,
    ImportCode,
    Modal,
    PaletteTypes
  },
  methods: {
    add () {
      this.$emit('add-colour')
    },
    selectColour (colour) {
      this.$emit('select-colour', colour)
    },
    removeColour (colour) {
      this.$emit('remove-colour', colour)
    },
    typeSelected (type) {
      console.log('cp ' + type)
      this.$emit('type-selected', type)
    },
    discard () {
      this.$emit('discard-palette')
    },
    importPalette (palette) {
      this.importModalOpen = false
      this.$emit('import-palette', palette)
    },
    keyUp (event) {
      if (event.target.tagName.toLowerCase() !== 'body') {
        return
      }

      let index = -1

      switch (event.key) {
        case '+':
          this.add()
          return

        case 'Down':
        case 'ArrowDown':
          index = this.selectedColourIndex
          if (index < this.palette.colours.length - 1) {
            this.selectColour(this.palette.colours[index + 1])
          }
          return

        case 'Up':
        case 'ArrowUp':
          index = this.selectedColourIndex
          if (index > 0) {
            this.selectColour(this.palette.colours[index - 1])
          }
      }
    }
  },
  created: function () {
    window.addEventListener('keyup', this.keyUp, false)
  },
  destroyed () {
    window.removeEventListener('keyup', this.keyUp)
  }
}
</script>

<style scoped lang="less">
@import '../variables.less';

.colourpalette {
  &-name {
    padding: 1rem;
    box-sizing: border-box;

    input {
      width: 100%;
      border: @border;
      background-color: #fff;
      padding: 0.5rem;
      font-size: 1.5rem;
      border-radius: 0.2rem;
      box-sizing: border-box;
    }
    input:hover {
      border: @border;
      border-color: @border-colour-hover;
    }
  }
  &-type {
    padding: 1rem;
    padding-top: 0;
  }
  &-actions {
    display: block;
    clear: both;
    list-style: none;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    height: 3rem;
    border-bottom: @border;
    text-align: right;
    overflow: hidden;

    > li {
      display: inline-block;
      height: 2.9rem;
      border-left: @border;
      width: 3rem;
      text-align: center;
      white-space: nowrap;

      .icon-button {
        font-size: 1.7rem;
        line-height: 2.9rem;
      }

      &.add {
        padding-top: 0.1rem;
        .icon-button {
          font-size: 1.9rem;
        }
      }
    }
  }
}
</style>
