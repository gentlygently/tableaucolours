<template>
  <ul class="colourlist">
    <draggable v-model="colours" class="colourlist-draggable">
      <Colour
        v-for="(colour, index) in colours"
        :key="colour.id"
        :colour="colour"
        :index="index"
        @select="select"
        @remove="remove"
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
  props: {
    colours: {
      type: Array,
      required: true
    }
  },
  components: {
    Colour,
    draggable
  },
  methods: {
    select (colour) {
      this.$emit('select-colour', colour)
    },
    remove (colour) {
      this.$emit('remove-colour', colour)
    }
  }
}
</script>

<style scoped lang="less">
.colourlist {
  margin: 0;
  padding: 1rem;

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
