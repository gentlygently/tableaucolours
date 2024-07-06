<template>
  <ul class="colourlist">
    <draggable
      v-model="colours"
      class="colourlist-draggable"
      :options="{ chosenClass: 'colour--dragging', delay: 25 }"
      @change="colourMoved"
    >
      <colour-swatch
        v-for="(colour, index) in colours"
        :key="colour.id"
        :colour="colour"
        :index="index"
        class="colourlist-colour"
      />
    </draggable>
  </ul>
</template>

<script>
import ColourSwatch from './ColourSwatch.vue'
import draggable from 'vuedraggable'
import { mapActions, mapState } from 'pinia'
import { usePaletteStore } from '../stores/palette'

export default {
  name: 'ColourList',
  components: {
    ColourSwatch,
    draggable,
  },
  computed: {
    ...mapState(usePaletteStore, { paletteColours: 'colours' }),
    colours: {
      get() {
        return this.paletteColours
      },
      set() {
        // ignore
      },
    },
    selectedColourIndex() {
      return this.colours.findIndex(x => x.isSelected)
    },
  },
  created: function () {
    window.addEventListener('keyup', this.keyUp, false)
  },
  destroyed() {
    window.removeEventListener('keyup', this.keyUp)
  },
  methods: {
    ...mapActions(usePaletteStore, ['moveColour', 'selectColour']),

    getColour(index) {
      if (index < 0 || index >= this.colours.length) {
        return null
      }
      return this.colours[index]
    },
    getValidColumnIndex(currentIndex, increment) {
      const newIndex = currentIndex + increment
      if (newIndex < 0 || newIndex >= this.colours.length) {
        return -1
      }
      const currentColumn = Math.floor(currentIndex / 5)
      const newColumn = Math.floor(newIndex / 5)

      return newColumn === currentColumn ? newIndex : -1
    },
    getValidRowIndex(currentIndex, increment) {
      const newIndex = currentIndex + increment
      if (newIndex < 0 || newIndex >= this.colours.length) {
        return -1
      }
      const currentRow = Math.floor(currentIndex % 5)
      const newRow = Math.floor(newIndex % 5)

      return newRow === currentRow ? newIndex : -1
    },
    select(colour) {
      if (colour) {
        this.selectColour(colour)
      }
    },
    selectByIndex(index) {
      this.select(this.getColour(index))
    },
    move(colour, newIndex) {
      this.moveColour(colour, newIndex)
    },
    moveSelectedColourToIndex(index) {
      if (index < 0) {
        return
      }
      this.move(this.colours[this.selectedColourIndex], index)
    },
    colourMoved(event) {
      this.move(this.colours[event.moved.oldIndex], event.moved.newIndex)
    },
    keyUp(event) {
      if (event.target.tagName.toLowerCase() !== 'body') {
        return
      }
      const action = event.getModifierState('Shift') ? this.moveSelectedColourToIndex : this.selectByIndex
      switch (event.key) {
        case 'Down':
        case 'ArrowDown':
          action(this.getValidColumnIndex(this.selectedColourIndex, 1))
          return

        case 'Up':
        case 'ArrowUp':
          action(this.getValidColumnIndex(this.selectedColourIndex, -1))
          return

        case 'Left':
        case 'ArrowLeft':
          action(this.getValidRowIndex(this.selectedColourIndex, -5))
          return

        case 'Right':
        case 'ArrowRight':
          action(this.getValidRowIndex(this.selectedColourIndex, 5))
      }
    },
  },
}
</script>

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
