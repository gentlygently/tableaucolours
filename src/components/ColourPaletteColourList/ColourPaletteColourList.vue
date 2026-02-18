<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ColourPaletteColourListItem from '../ColourPaletteColourListItem/ColourPaletteColourListItem.vue'
import { VueDraggable } from 'vue-draggable-plus'
import { usePaletteStore } from '@/stores/palette'
import { ColourPaletteColourListTestIds } from '@/test-ids/ColourPaletteColourListTestIds'

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
  <VueDraggable
    v-model="colours"
    class="colourlist"
    tag="ul"
    :data-testid="ColourPaletteColourListTestIds.Self"
    :options="{ delay: 25 }"
    dragClass="colourlist-colour--drag"
    @update="colourMoved"
    @start="draggingActive = true"
    @end="draggingActive = false"
  >
    <ColourPaletteColourListItem
      v-for="(colour, index) in colours"
      :key="colour.id"
      :colour="colour"
      :index="index"
      :draggingActive="draggingActive"
      class="colourlist-colour"
    />
  </VueDraggable>
</template>

<style scoped lang="less">
@import '../../variables.less';
.colourlist {
  margin: 1rem;
  height: 31rem;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);

  border-radius: 0.2rem;
  box-sizing: border-box;
  box-shadow: @box-shadow;
  background-color: @background-colour;

  &-colour {
    display: block;
    position: relative;

    &--drag {
      margin: 0;
    }
  }
}
</style>
