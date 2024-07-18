<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { usePaletteStore } from '@/stores/palette'
import { useTpsFileStore } from '@/stores/tpsfile'
import { replacePalettesInTpsXml } from '../utils/TpsWriter'
import TpsPaletteList from './TpsPaletteList.vue'
import TpsPaletteFilter from './TpsPaletteFilter.vue'
import TpsPaletteExport from './TpsPaletteExport.vue'

const tpsStore = useTpsFileStore()
const paletteStore = usePaletteStore()
const paletteAction = ref('')
const isFilterOpen = ref(false)
const isExportOpen = ref(false)
const currentPaletteIndex = computed(() => tpsStore.filteredPalettes.findIndex(x => x.isCurrent))

const save = () => savePalettes(tpsStore.fileName, tpsStore.palettes, f => tpsStore.saved(f))

const exportSelectedPalettes = fileName => savePalettes(fileName, tpsStore.selectedPalettes)

async function savePalettes(fileName, palettes, savedCallback) {
  const xml = replacePalettesInTpsXml(tpsStore.fileContents, palettes)

  if (!window.showSaveFilePicker) {
    download(fileName, xml)
    return
  }

  try {
    const fileHandle = await window.showSaveFilePicker({
      id: 'gently-gently',
      suggestedName: fileName,
      types: [
        {
          description: 'Tableau preferences file',
          accept: { 'text/plain': ['.tps'] },
        },
      ],
    })
    const writable = await fileHandle.createWritable()
    await writable.write(xml)
    await writable.close()

    const file = await fileHandle.getFile()

    if (savedCallback) savedCallback(file.name)
  } catch (e) {
    if (e.name === 'AbortError') return
    console.error(e)
    download(fileName, xml)
  }
}

function download(fileName, xml) {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(xml))
  element.setAttribute('download', fileName)
  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
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
      case 'clone':
        action = tpsStore.addPalette
        break

      case 'edit':
        action = tpsStore.updateCurrentPalette
        break
    }
    if (action) action(paletteStore.name, paletteStore.type, paletteStore.colours)
  }

  paletteAction.value = ''
})

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

function deleteSelectedPalettes() {
  const selected = tpsStore.selectedPalettes

  if (!selected.length) return

  if (selected.length === 1) return deletePalette(selected[0])

  if (confirm(`Are you sure you want to delete ${selected.length} palettes?`))
    tpsStore.deleteSelectedPalettes()
}

function clonePalette(palette) {
  paletteAction.value = 'clone'
  paletteStore.open(palette)
  paletteStore.name = (palette.name + ' (Copy)').trim()
}

function makePaletteAtIndexCurrent(index) {
  if (index >= 0 && index < tpsStore.filteredPalettes.length)
    tpsStore.setCurrentPalette(tpsStore.filteredPalettes[index])
}

function toggleFilter() {
  isFilterOpen.value = !isFilterOpen.value
  tpsStore.isFilterActive = isFilterOpen.value
}

function moveCurrentPalete(newIndex) {
  if (tpsStore.canMovePalettes) tpsStore.movePalette(tpsStore.currentPalette, newIndex)
}

// Actions that can repeat when a key is held down
function keyDown(event) {
  if (!isValidKeyTarget || !tpsStore.hasCurrentPalette) return

  const action = event.getModifierState('Shift') ? moveCurrentPalete : makePaletteAtIndexCurrent

  switch (event.key) {
    case 'Down':
    case 'ArrowDown':
      action(currentPaletteIndex.value + 1)
      event.preventDefault()
      return

    case 'Up':
    case 'ArrowUp':
      action(currentPaletteIndex.value - 1)
      event.preventDefault()
      return
  }
}

// Actions that should only happen once per key press
function keyUp(event) {
  if (!isValidKeyTarget(event)) return

  switch (event.key) {
    case '+':
      addPalette()
      return
  }

  if (!tpsStore.hasCurrentPalette) return

  switch (event.key) {
    case 'Enter':
      openPalette(tpsStore.currentPalette)
      return

    case 'Backspace':
    case 'Delete':
      deletePalette(tpsStore.currentPalette)
      return
  }
}

const isValidKeyTarget = e => !paletteStore.isOpen && e.target.tagName.toLowerCase() === 'body'

onMounted(() => {
  window.addEventListener('keydown', keyDown, false)
  window.addEventListener('keyup', keyUp, false)
})
onUnmounted(() => {
  window.removeEventListener('keydown', keyDown)
  window.removeEventListener('keyup', keyUp)
})
</script>

<template>
  <div class="tpseditor">
    <div class="file">{{ tpsStore.fileName }}</div>
    <div class="palettes">
      <TpsPaletteList
        @double-click-palette="openPalette"
        @delete-palette="deletePalette"
        @clone-palette="clonePalette"
        @move-palette="tpsStore.movePalette"
      />
    </div>
    <ul class="paletteactions">
      <li class="paletteactions-add">
        <button title="Add palette (+)" @click.prevent.stop="addPalette">
          <span class="fas fa-plus"></span> Add palette
        </button>
      </li>
      <li class="paletteactions-delete">
        <button
          title="Delete selected palettes"
          :disabled="!tpsStore.hasSelectedPalettes"
          @click.prevent.stop="deleteSelectedPalettes"
        >
          <span class="fas fa-trash-alt"></span> Delete selected palettes
        </button>
      </li>
      <li class="paletteactions-selectall">
        <button
          title="Select all palettes"
          :disabled="!tpsStore.filteredPalettes.length"
          @click.prevent.stop="tpsStore.selectAllPalettes"
        >
          <span class="fas fa-check-circle"></span> Select all
        </button>
      </li>
      <li class="paletteactions-clear">
        <button
          title="Clear palette selection"
          :disabled="!tpsStore.hasSelectedPalettes"
          @click.prevent.stop="tpsStore.clearPaletteSelection"
        >
          <span class="fas fa-broom"></span> Clear selection
        </button>
      </li>
      <li class="paletteactions-filter" :class="{ 'paletteactions-filter--active': isFilterOpen }">
        <button
          title="Filter palettes"
          :disabled="!tpsStore.palettes.length"
          @click.prevent.stop="toggleFilter"
        >
          <span class="fas fa-filter"></span> Filter palettes
        </button>
        <Transition name="actionform">
          <div class="actionform" v-if="isFilterOpen">
            <div class="actionform-arrow"></div>
            <div class="actionform-form">
              <TpsPaletteFilter />
            </div>
          </div>
        </Transition>
      </li>
      <li class="paletteactions-export" :class="{ 'paletteactions-export--active': isExportOpen }">
        <button
          title="Export selected palettes to new file"
          :disabled="!tpsStore.palettes.length"
          @click.prevent.stop="isExportOpen = !isExportOpen"
        >
          <span class="fas fa-file-export"></span> Export selected palettes
        </button>
        <Transition name="actionform">
          <div class="actionform" v-if="isExportOpen">
            <div class="actionform-arrow"></div>
            <div class="actionform-form">
              <TpsPaletteExport @export="exportSelectedPalettes" />
            </div>
          </div>
        </Transition>
      </li>
    </ul>
    <div class="fileactions">
      <button class="button" title="Close file" @click.prevent.stop="close">Close</button>
      <button
        class="button"
        title="Save changes"
        :disabled="!tpsStore.hasChanges"
        @click.prevent.stop="save"
      >
        Save
      </button>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '../variables.less';

.tpseditor {
  position: relative;
  display: grid;
  grid-template-rows: 4rem minmax(0, 1fr) 6rem;
  grid-template-columns: minmax(0, 1fr) 22rem;
  grid-gap: 1rem;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
.file {
  grid-row: 1;
  grid-column: 1 / span 2;
  font-size: 2.5rem;
  font-weight: bold;
}
.fileactions {
  grid-row: 3;
  grid-column: 1 / span 2;
  padding-top: 2rem;
  margin: auto;

  > button {
    font-size: 1.8rem;
    padding: 1rem;
    width: 15rem;
    margin: 0 1rem;
  }
}
.palettes {
  grid-row: 2;
  grid-column: 1 / span 1;
}

.paletteactions {
  grid-row: 2;
  grid-column: 2 / span 1;
  display: block;
  list-style: none;
  margin: 0;
  padding: 0;

  > li {
    margin-left: 1rem;
    margin-bottom: 0.7rem;
    color: @tool-colour;

    > button {
      border: 0;
      outline: 0;
      background-color: transparent;
      font-size: 1.5rem;

      &:hover {
        color: @tool-colour-hover;

        > span {
          color: @button-colour;
        }
      }

      &:disabled,
      &:disabled > span {
        color: @tool-colour-disabled;
      }

      > span {
        padding-right: 0.5rem;
      }
    }
  }

  &-selectall span {
    font-size: 1.4rem;
  }

  &-clear span {
    font-size: 1.1rem;
  }

  &-export span {
    font-size: 1.3rem;
  }

  &-filter--active > button,
  &-export--active > button {
    color: @tool-colour-hover;

    > span {
      color: @button-colour;
    }

    &:hover,
    &:hover > span {
      color: @button-colour-hover;
    }
  }
}

.actionform {
  margin-left: 1rem;
  transform-origin: left top;
  transform: scaleY(1);

  &-enter-active,
  &-leave-active {
    transition: all 0.1s ease-in-out;
  }

  &-enter-from,
  &-leave-to {
    transform: scaleY(0);
  }

  &-form {
    background-color: @background-colour;
    border-radius: 0.5rem;
  }

  &-arrow {
    width: 0;
    height: 0;
    border-left: 1rem solid transparent;
    border-right: 1rem solid transparent;
    border-bottom: 1rem solid @background-colour;
    margin-left: 2rem;
    background-color: #fff;
  }
}
</style>
