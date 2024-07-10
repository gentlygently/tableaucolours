<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ColourSwatch from './ColourSwatch.vue'
import { VueDraggable } from 'vue-draggable-plus'
import { usePaletteStore } from '../stores/palette'

const store = usePaletteStore()
const draggingActive = ref(false)

const colours = computed({
  get() {
    return store.colours
  },
  set() {
    // Do nothing (we handle the change in colourMoved)
  },
})

const selectedColourIndex = computed(() => store.colours.findIndex(x => x.isSelected))

function getColour(index) {
  if (index < 0 || index >= store.colours.length) {
    return null
  }
  return store.colours[index]
}

function getValidColumnIndex(currentIndex, increment) {
  const newIndex = currentIndex + increment
  if (newIndex < 0 || newIndex >= store.colours.length) {
    return -1
  }
  const currentColumn = Math.floor(currentIndex / 5)
  const newColumn = Math.floor(newIndex / 5)

  return newColumn === currentColumn ? newIndex : -1
}

function getValidRowIndex(currentIndex, increment) {
  const newIndex = currentIndex + increment
  if (newIndex < 0 || newIndex >= store.colours.length) {
    return -1
  }
  const currentRow = Math.floor(currentIndex % 5)
  const newRow = Math.floor(newIndex % 5)

  return newRow === currentRow ? newIndex : -1
}

function select(colour) {
  if (colour) {
    store.selectColour(colour)
  }
}

function selectByIndex(index) {
  select(getColour(index))
}

function move(colour, newIndex) {
  store.moveColour(colour, newIndex)
}

function moveSelectedColourToIndex(index) {
  if (index < 0) {
    return
  }
  move(store.colours[selectedColourIndex.value], index)
}

function colourMoved(event) {
  move(store.colours[event.oldIndex], event.newIndex)
}

function keyUp(event) {
  if (event.target.tagName.toLowerCase() !== 'body') {
    return
  }
  const action = event.getModifierState('Shift') ? moveSelectedColourToIndex : selectByIndex
  switch (event.key) {
    case 'Down':
    case 'ArrowDown':
      action(getValidColumnIndex(selectedColourIndex.value, 1))
      return

    case 'Up':
    case 'ArrowUp':
      action(getValidColumnIndex(selectedColourIndex.value, -1))
      return

    case 'Left':
    case 'ArrowLeft':
      action(getValidRowIndex(selectedColourIndex.value, -5))
      return

    case 'Right':
    case 'ArrowRight':
      action(getValidRowIndex(selectedColourIndex.value, 5))
  }
}

onMounted(() => window.addEventListener('keyup', keyUp, false))

onUnmounted(() => window.removeEventListener('keyup', keyUp))
</script>

<template>
  <ul class="colourlist">
    <VueDraggable
      v-model="colours"
      class="colourlist-draggable"
      :options="{ delay: 25 }"
      @update="colourMoved"
      @start="draggingActive = true"
      @end="draggingActive = false"
    >
      <ColourSwatch
        v-for="(colour, index) in colours"
        :key="colour.id"
        :colour="colour"
        :index="index"
        :draggingActive="draggingActive"
        class="colourlist-colour"
      />
    </VueDraggable>
  </ul>
</template>

<style scoped lang="less">
.colourlist {
  margin: 0;
  height: 29rem;

  &-draggable {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 5rem 5rem 5rem 5rem;
  }

  &-colour {
    display: block;
    position: relative;
  }
}
</style>
