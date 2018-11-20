<template>
  <ul class="colourlist">
    <draggable
      v-model="colours"
      class="colourlist-draggable"
      @change="colourMoved"
      :options="{ chosenClass: 'colour--dragging', delay: 25 }"
    >
      <Colour
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
import Colour from './Colour.vue'
import draggable from 'vuedraggable'

export default {
  name: 'ColourList',
  components: {
    Colour,
    draggable
  },
  computed: {
    colours: {
      get () {
        return this.$store.state.palette.colours
      },
      set (newValue) {
        // ignore
      }
    },
    selectedColourIndex () {
      return this.colours.findIndex(x => x.isSelected)
    }
  },
  methods: {
    getColour (index) {
      if (index < 0 || index >= this.colours.length) {
        return null
      }
      return this.colours[index]
    },
    getValidColumnIndex (currentIndex, increment) {
      const newIndex = currentIndex + increment
      if (newIndex < 0 || newIndex >= this.colours.length) {
        return -1
      }
      const currentColumn = Math.floor(currentIndex / 5)
      const newColumn = Math.floor(newIndex / 5)

      return newColumn === currentColumn ? newIndex : -1
    },
    getValidRowIndex (currentIndex, increment) {
      const newIndex = currentIndex + increment
      if (newIndex < 0 || newIndex >= this.colours.length) {
        return -1
      }
      const currentRow = Math.floor(currentIndex % 5)
      const newRow = Math.floor(newIndex % 5)

      return newRow === currentRow ? newIndex : -1
    },
    select (colour) {
      if (colour) {
        this.$store.commit('palette/selectColour', { colour })
      }
    },
    selectByIndex (index) {
      this.select(this.getColour(index))
    },
    move (colour, newIndex) {
      this.$store.commit('palette/moveColour', { colour, newIndex })
    },
    moveSelectedColourToIndex (index) {
      if (index < 0) {
        return
      }
      this.move(this.colours[this.selectedColourIndex], index)
    },
    colourMoved (event) {
      this.move(this.colours[event.moved.oldIndex], event.moved.newIndex)
    },
    keyUp (event) {
      if (event.target.tagName.toLowerCase() !== 'body') {
        return
      }
      const action = event.getModifierState('Shift')
        ? this.moveSelectedColourToIndex
        : this.selectByIndex
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
