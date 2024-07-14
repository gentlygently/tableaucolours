<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { usePaletteStore } from '@/stores/palette'
import { useTpsFileStore } from '@/stores/tpsfile'
import { parseFile } from './TpsParser'
import ModalPanel from './ModalPanel.vue'
import TpsErrors from './TpsErrors.vue'
import TpsFileOpen from './TpsFileOpen.vue'
import TpsPaletteList from './TpsPaletteList.vue'

const tpsStore = useTpsFileStore()
const paletteStore = usePaletteStore()
const parserErrors = ref(null)
const paletteAction = ref('')
const hasParserErrors = computed(() => parserErrors.value !== null)
const selectedPaletteIndex = computed(() => tpsStore.palettes.findIndex(x => x.isSelected))

function openPalette(palette) {
  paletteAction.value = 'edit'
  paletteStore.open(palette)
}

function openPaletteClick() {
  paletteStore.open()
}

function fileSelected(files) {
  if (!files || !files.length) {
    return
  }

  const reader = new FileReader()

  reader.onload = function (event) {
    const fileName = files[0].name
    const result = parseFile(event.target.result)

    if (!result.isValid) {
      parserErrors.value = { fileName: fileName, errors: result.validationMessages }
      tpsStore.close()
      return
    }

    tpsStore.open(fileName, result.palettes)
  }

  reader.readAsText(files[0])
}

function close() {
  if (tpsStore.hasChanges && !confirm('Close without saving?')) return
  tpsStore.close()
}

const isPaletteOpen = computed(() => paletteStore.isOpen)

watch(isPaletteOpen, isOpen => {
  if (isOpen) return

  if (tpsStore.isOpen && paletteStore.hasChanges) {
    if (paletteAction.value === 'edit')
      tpsStore.updateSelectedPalette(paletteStore.name, paletteStore.type, paletteStore.colours)
  }

  paletteAction.value = ''
})

function selectPaletteAtIndex(index) {
  if (index >= 0 && index < tpsStore.palettes.length) tpsStore.selectPalette(tpsStore.palettes[index])
}

function keyUp(event) {
  if (paletteStore.isOpen || event.target.tagName.toLowerCase() !== 'body') {
    return
  }

  if (tpsStore.hasSelectedPalette) {
    switch (event.key) {
      case 'Enter':
        openPalette(tpsStore.selectedPalette)
        return
      case 'Down':
      case 'ArrowDown':
        selectPaletteAtIndex(selectedPaletteIndex.value + 1)
        return

      case 'Up':
      case 'ArrowUp':
        selectPaletteAtIndex(selectedPaletteIndex.value - 1)
        return
    }
  }
}

onMounted(() => window.addEventListener('keyup', keyUp, false))
onUnmounted(() => window.removeEventListener('keyup', keyUp))
</script>

<template>
  <div class="tpseditor">
    <div class="toolbar"></div>
    <div class="file">
      <TpsFileOpen
        :selected-file-name="tpsStore.fileName"
        :is-file-open="tpsStore.isOpen"
        @file-selected="fileSelected"
      />
    </div>
    <template v-if="tpsStore.isOpen">
      <div class="palettes">
        <TpsPaletteList @palette-double-click="openPalette" />
      </div>
      <ul class="paletteactions">
        <li class="paletteactions-save">
          <button
            class="iconbutton fas fa-save"
            title="Save changes"
            :disabled="!tpsStore.hasChanges"
            @click.prevent.stop="save"
          ></button>
        </li>
        <li class="paletteactions-close">
          <button class="iconbutton fas fa-times" title="Close file" @click.prevent.stop="close"></button>
        </li>
        <li class="paletteactions-empty"></li>
        <li class="paletteactions-filter">
          <button
            class="iconbutton fas fa-filter"
            title="Filter palettes"
            :disabled="!tpsStore.palettes.length"
            @click.prevent.stop="discard"
          ></button>
        </li>
        <li class="paletteactions-add">
          <button class="iconbutton fas fa-plus" title="Add palette (+)" @click.prevent.stop="addPalette"></button>
        </li>
      </ul>
    </template>
    <div class="standalone" v-if="!tpsStore.isOpen">
      <button class="openpalette" @click.stop.prevent="openPaletteClick">Create standalone palette</button>
    </div>

    <ModalPanel :show="hasParserErrors" width="54rem" @close="parserErrors = null">
      <TpsErrors :errors="parserErrors.errors" :fileName="parserErrors.fileName" @close="parserErrors = null" />
    </ModalPanel>
  </div>
</template>

<style scoped lang="less">
@import '../variables.less';

.tpseditor {
  &-close {
    font-size: 2rem;
    vertical-align: middle;
    position: relative;
  }
}
.toolbar {
  height: 4rem;
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
}
.file {
  padding: 1rem;
}
.palettes {
  padding: 0 1rem;
}
.paletteactions {
  display: block;
  clear: both;
  list-style: none;
  margin: auto;
  width: 22.5rem;
  padding: 0;
  margin-top: 1rem;
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
    &.paletteactions-save,
    &.paletteactions-close,
    &.paletteactions-add {
      padding-top: 0;
      .iconbutton {
        font-size: 2rem;
      }
    }
  }
}
.openpalette {
  border: none;
  outline: none;
  padding: 0.5rem;
  font-size: 1.5rem;
  color: #fff;
  background-color: @button-colour;
  text-align: center;
  width: 20rem;
  margin-top: 1rem;
  margin-left: 2.5rem;

  &:hover {
    background-color: @button-colour-hover;
  }
}
</style>
