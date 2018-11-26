<template>
  <div class="colourpalette">
    <div class="colourpalette-name">
      <input
        type="text"
        id="name"
        :value="palette.name"
        tabindex="1"
        placeholder="Enter a palette name"
        @input="nameChanged"
      >
    </div>
    <div class="colourpalette-type">
      <palette-types
        :selected-type-name="palette.type"
        :tab-index="2"
        @type-selected="typeSelected"
      />
    </div>
    <colour-list class="colourpalette-colours"/>
    <div class="colourpalette-preview">
      <palette-preview :palette="palette"/>
    </div>
    <ul class="colourpalette-actions">
      <!-- TODO: Put these in a separate component? -->
      <li class="extract">
        <button
          @click.prevent.stop="extractModalOpen = true"
          class="iconbutton fas fa-magic"
          title="Extract colours from image (magic!)"
          :disabled="!canExtractColours"
        ></button>
      </li>
      <li class="import">
        <button
          @click.prevent.stop="importModalOpen = true"
          class="iconbutton fas fa-file-import"
          title="Import XML"
        ></button>
      </li>
      <li class="code">
        <button
          @click.prevent.stop="codeModalOpen = true"
          class="iconbutton fas fa-code"
          title="Get XML"
        ></button>
      </li>
      <li class="discard">
        <button
          @click.prevent.stop="discard"
          class="iconbutton fas fa-trash-alt"
          title="Delete palette"
        ></button>
      </li>
      <li class="add">
        <button
          @click.prevent.stop="addColour"
          class="iconbutton fas fa-plus"
          title="Add colour (+)"
          :disabled="!canAddColour"
        ></button>
      </li>
    </ul>
    <modal v-if="codeModalOpen" width="54rem" @close="codeModalOpen = false">
      <get-code/>
    </modal>
    <modal v-if="importModalOpen" width="54rem" @close="importModalOpen = false">
      <import-code @close="importModalOpen = false"/>
    </modal>
    <modal v-if="extractModalOpen" width="54rem" @close="extractModalOpen = false">
      <extract-colours @close="extractModalOpen = false"/>
    </modal>
  </div>
</template>

<script>
import ColourList from './ColourList.vue'
import GetCode from './GetCode.vue'
import ExtractColours from './ExtractColours.vue'
import ImportCode from './ImportCode.vue'
import Modal from './Modal.vue'
import PalettePreview from './PalettePreview.vue'
import PaletteTypes from './PaletteTypes.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'ColourPalette',
  data: function () {
    return {
      codeModalOpen: false,
      extractModalOpen: false,
      importModalOpen: false
    }
  },
  computed: {
    ...mapGetters({
      canAddColour: 'palette/canAddColour',
      canExtractColours: 'image/hasImage'
    }),
    palette () {
      return this.$store.state.palette
    }
  },
  components: {
    ColourList,
    GetCode,
    ExtractColours,
    ImportCode,
    Modal,
    PalettePreview,
    PaletteTypes
  },
  methods: {
    addColour () {
      this.$store.dispatch('palette/addColour')
    },
    discard () {
      if (confirm('Are you sure you want to discard this palette?')) {
        this.$store.commit('palette/reset')
      }
    },
    keyUp (event) {
      if (event.target.tagName.toLowerCase() !== 'body') {
        return
      }
      switch (event.key) {
        case '+':
          this.addColour()
          return

        case 'Backspace':
        case 'Delete':
          this.removeSelectedColour()
      }
    },
    nameChanged (e) {
      this.$store.commit('palette/setName', { name: e.target.value })
    },
    removeSelectedColour () {
      console.log(this.$store.getters)
      this.$store.commit('palette/removeColour', {
        colour: this.$store.getters['palette/selectedColour']
      })
    },
    typeSelected (type) {
      this.$store.commit('palette/setType', { type })
    }
  },
  created () {
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
      outline: none;
      box-shadow: @box-shadow;
    }
    input:hover {
      border: @border;
      border-color: @border-colour-hover;
      box-shadow: @box-shadow-hover;
    }
    input:focus {
      box-shadow: @box-shadow-active;
    }
  }
  &-type {
    padding: 1rem;
    padding-top: 0;
  }
  &-colours {
    padding: 1rem;
    padding-top: 0;
  }
  &-preview {
    padding: 1rem;
    padding-top: 0;
  }
  &-actions {
    display: block;
    clear: both;
    list-style: none;
    margin: auto;
    width: 22.5rem;
    padding: 0;
    box-sizing: border-box;

    > li {
      display: inline-block;
      height: 4rem;
      width: 4.5rem;
      border-left: @border;
      border-top: @border;
      border-bottom: @border;
      text-align: center;
      white-space: nowrap;
      box-sizing: border-box;
      overflow: hidden;

      &:last-of-type {
        border-right: @border;
      }
      .iconbutton {
        font-size: 1.7rem;
        line-height: 3.8rem;
      }

      &.add {
        padding-top: 0.1rem;
        .iconbutton {
          font-size: 1.9rem;
        }
      }
    }
  }
}
</style>
