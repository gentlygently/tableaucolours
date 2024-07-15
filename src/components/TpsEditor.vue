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
    let action = null
    switch (paletteAction.value) {
      case 'add':
        action = tpsStore.addPalette
        break

      case 'edit':
        action = tpsStore.updateSelectedPalette
        break
    }
    if (action) action(paletteStore.name, paletteStore.type, paletteStore.colours)
  }

  paletteAction.value = ''
})

function selectPaletteAtIndex(index) {
  if (index >= 0 && index < tpsStore.palettes.length) tpsStore.selectPalette(tpsStore.palettes[index])
}

const openPaletteEditor = () => paletteStore.open()

function openPalette(palette) {
  paletteAction.value = 'edit'
  paletteStore.open(palette)
}

function addPalette() {
  paletteAction.value = 'add'
  paletteStore.open()
}

function deletePalette(palette) {
  if (!palette) return

  const name = palette.name ? `'${palette.name}'` : 'this palette'

  if (confirm(`Are you sure you want to delete ${name}?`)) tpsStore.deletePalette(palette)
}

function keyUp(event) {
  if (paletteStore.isOpen || event.target.tagName.toLowerCase() !== 'body') {
    return
  }

  switch (event.key) {
    case '+':
      addPalette()
      return
  }

  if (tpsStore.hasSelectedPalette) {
    switch (event.key) {
      case 'Enter':
        openPalette(tpsStore.selectedPalette)
        return

      case 'Backspace':
      case 'Delete':
        deletePalette(tpsStore.selectedPalette)
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
        <TpsPaletteList @double-click-palette="openPalette" @delete-palette="deletePalette" />
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
      <button class="openpalette" @click.stop.prevent="openPaletteEditor">Create standalone palette</button>
    </div>

    <ModalPanel :show="hasParserErrors" width="54rem" @close="parserErrors = null">
      <TpsErrors :errors="parserErrors.errors" :fileName="parserErrors.fileName" @close="parserErrors = null" />
    </ModalPanel>
  </div>
</template>

<style scoped lang="less">
@import '../variables.less';

.tpseditor {
  height: 100%;
  width: 100%;
  position: relative;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 4rem 5rem minmax(0, 1fr) 7rem;
}
.toolbar {
  grid-row: 1 / span 1;
}
.file {
  grid-row: 2 / span 1;
  padding: 1rem;
}
.palettes {
  grid-row: 3 / span 1;
  padding: 0 1rem;
  max-height: 100%;
}
.paletteactions {
  grid-row: 4 / span 1;
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
  grid-row: 3;
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
