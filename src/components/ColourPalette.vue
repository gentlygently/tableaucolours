<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ColourList from './ColourList.vue'
import GetCode from './GetCode.vue'
import ExtractColours from './ExtractColours.vue'
import ImportCode from './ImportCode.vue'
import ModalPanel from './ModalPanel.vue'
import PalettePreview from './PalettePreview.vue'
import PaletteTypes from './PaletteTypes.vue'
import { usePaletteStore } from '@/stores/palette'
import { useImageStore } from '@/stores/image'

const imageStore = useImageStore()
const paletteStore = usePaletteStore()
const canAddColour = computed(() => paletteStore.canAddColour)
const canExtractColours = computed(() => imageStore.hasImage)
const codeModalOpen = ref(false)
const extractModalOpen = ref(false)
const importModalOpen = ref(false)

function close() {
  paletteStore.close()
}

function discard() {
  if (confirm('Are you sure you want to discard this palette?')) {
    paletteStore.resetPalette()
  }
}

function addColour() {
  paletteStore.addColour()
}

function keyUp(event) {
  if (event.target.tagName.toLowerCase() !== 'body') {
    return
  }
  switch (event.key) {
    case '+':
      paletteStore.addColour()
      return

    case 'Backspace':
    case 'Delete':
      removeSelectedColour()
  }
}

function removeSelectedColour() {
  paletteStore.removeColour(paletteStore.selectedColour)
}

function typeSelected(type) {
  paletteStore.type = type
}

onMounted(() => window.addEventListener('keyup', keyUp, false))
onUnmounted(() => window.removeEventListener('keyup', keyUp))
</script>

<template>
  <div class="colourpalette">
    <div class="colourpalette-toolbar">
      <button
        class="back iconbutton fas fa-arrow-left"
        title="Back to file editor"
        @click.prevent.stop="close"
      ></button>
    </div>
    <div class="colourpalette-name">
      <input
        id="name"
        v-model="paletteStore.name"
        type="text"
        tabindex="1"
        placeholder="Enter a palette name"
        autocomplete="off"
      />
    </div>
    <div class="colourpalette-type">
      <PaletteTypes :selected-type-name="paletteStore.type" :tab-index="2" @type-selected="typeSelected" />
    </div>
    <ColourList class="colourpalette-colours" />
    <div class="colourpalette-preview">
      <PalettePreview :type="paletteStore.type" :colours="paletteStore.colours" />
    </div>
    <ul class="colourpalette-actions">
      <!-- TODO: Put these in a separate component? -->
      <li class="extract">
        <button
          class="iconbutton fas fa-magic"
          title="Extract colours from image (magic!)"
          :disabled="!canExtractColours"
          @click.prevent.stop="extractModalOpen = true"
        ></button>
      </li>
      <li class="import">
        <button
          class="iconbutton fas fa-file-import"
          title="Import XML"
          @click.prevent.stop="importModalOpen = true"
        ></button>
      </li>
      <li class="code">
        <button class="iconbutton fas fa-code" title="Get XML" @click.prevent.stop="codeModalOpen = true"></button>
      </li>
      <li class="discard">
        <button class="iconbutton fas fa-trash-alt" title="Delete palette" @click.prevent.stop="discard"></button>
      </li>
      <li class="add">
        <button
          class="iconbutton fas fa-plus"
          title="Add colour (+)"
          :disabled="!canAddColour"
          @click.prevent.stop="addColour"
        ></button>
      </li>
    </ul>
    <ModalPanel :show="codeModalOpen" width="54rem" @close="codeModalOpen = false">
      <GetCode />
    </ModalPanel>
    <ModalPanel :show="importModalOpen" width="54rem" @close="importModalOpen = false">
      <ImportCode @close="importModalOpen = false" />
    </ModalPanel>
    <ModalPanel :show="extractModalOpen" width="54rem" @close="extractModalOpen = false">
      <ExtractColours @close="extractModalOpen = false" />
    </ModalPanel>
  </div>
</template>

<style scoped lang="less">
@import '../variables.less';

.colourpalette {
  &-toolbar {
    width: 100%;
    height: 4rem;

    .back {
      font-size: 2rem;
      vertical-align: middle;
      position: relative;
      margin: 1.2rem;
    }
  }
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
    padding-top: 0.75rem;
  }
  &-preview {
    padding: 1rem;
    padding-top: 0;
    height: 3rem;
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
