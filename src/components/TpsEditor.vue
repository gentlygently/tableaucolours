<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { usePaletteStore } from '@/stores/palette'
import { useTpsFileStore } from '@/stores/tpsfile'
import { replacePalettesInTpsXml } from '../utils/TpsWriter'
import TpsPaletteList from './TpsPaletteList.vue'
import TpsPaletteFilter from './TpsPaletteFilter.vue'

const tpsStore = useTpsFileStore()
const paletteStore = usePaletteStore()
const paletteAction = ref('')
const isFilterOpen = ref(false)
const selectedPaletteIndex = computed(() => tpsStore.filteredPalettes.findIndex(x => x.isSelected))

async function save() {
  const xml = replacePalettesInTpsXml(tpsStore.fileContents, tpsStore.palettes)

  if (!window.showSaveFilePicker) {
    download(tpsStore.fileName, xml)
    return
  }

  try {
    const fileHandle = await window.showSaveFilePicker({
      id: 'gently-gently',
      suggestedName: tpsStore.fileName,
      types: [
        {
          description: 'Tableau settings file',
          accept: { 'text/plain': ['.tps'] },
        },
      ],
    })
    const writable = await fileHandle.createWritable()
    await writable.write(xml)
    await writable.close()

    const file = await fileHandle.getFile()

    tpsStore.saved(file.name)
  } catch (e) {
    if (e.name === 'AbortError') return
    console.error(e)
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
        action = tpsStore.updateSelectedPalette
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

function clonePalette(palette) {
  paletteAction.value = 'clone'
  paletteStore.open(palette)
  paletteStore.name = (palette.name + ' (Copy)').trim()
}

function selectPaletteAtIndex(index) {
  if (index >= 0 && index < tpsStore.filteredPalettes.length) tpsStore.selectPalette(tpsStore.filteredPalettes[index])
}

function toggleFilter() {
  isFilterOpen.value = !isFilterOpen.value
  tpsStore.isFilterActive = isFilterOpen.value
}

function moveSelectedPalette(newIndex) {
  if (!tpsStore.hasActiveFilters) tpsStore.movePalette(tpsStore.selectedPalette, newIndex)
}

// Actions that can repeat when a key is held down
function keyDown(event) {
  if (!isValidKeyTarget || !tpsStore.hasSelectedPalette) return

  const action = event.getModifierState('Shift') ? moveSelectedPalette : selectPaletteAtIndex

  switch (event.key) {
    case 'Down':
    case 'ArrowDown':
      action(selectedPaletteIndex.value + 1)
      event.preventDefault()
      return

    case 'Up':
    case 'ArrowUp':
      action(selectedPaletteIndex.value - 1)
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

  if (!tpsStore.hasSelectedPalette) return

  switch (event.key) {
    case 'Enter':
      openPalette(tpsStore.selectedPalette)
      return

    case 'Backspace':
    case 'Delete':
      deletePalette(tpsStore.selectedPalette)
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
    <div class="toolbar"></div>
    <div class="file"></div>
    <template v-if="tpsStore.isOpen">
      <div class="palettes">
        <TpsPaletteList
          @double-click-palette="openPalette"
          @delete-palette="deletePalette"
          @clone-palette="clonePalette"
          @move-palette="tpsStore.movePalette"
        />
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
            :class="{ 'paletteactions-filter--active': isFilterOpen }"
            :disabled="!tpsStore.palettes.length"
            @click.prevent.stop="toggleFilter"
          ></button>
        </li>
        <li class="paletteactions-add">
          <button class="iconbutton fas fa-plus" title="Add palette (+)" @click.prevent.stop="addPalette"></button>
        </li>
      </ul>
      <div class="filter" v-if="isFilterOpen">
        <div class="filter-arrow"></div>
        <TpsPaletteFilter />
      </div>
    </template>
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
  grid-template-rows: 4rem 5rem minmax(0, 1fr) 7rem auto;
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
  height: 100%;
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

  &-filter--active {
    color: @button-colour;

    &:hover {
      color: @button-colour-hover;
    }
  }
}
.filter {
  grid-row: 5 / span 1;
  margin: 1rem;
  margin-top: -1.7rem;

  &-arrow {
    width: 0;
    height: 0;
    border-left: 1.3rem solid transparent;
    border-right: 1.3rem solid transparent;
    border-bottom: 1.3rem solid @border-colour;
    margin-left: 14.8rem;
  }
}
</style>
