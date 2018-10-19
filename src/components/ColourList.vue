<template>
    <ul>
        <Colour 
            v-for="colour in colours" 
            :key="colour.id"
            :colour="colour"
            @select="select"
            @remove="remove"
            class="colour" />
    </ul>
</template>

<script>
import Colour from './Colour.vue'

export default {
  name: 'ColourList',
  props: {
    colours: {
        type: Array,
        required: true
    }
  },
  components: {
    Colour
  },
  methods: {
      select (colour) {
          this.$emit('select-colour', colour);
      },
      remove (colour) {
          this.$emit('remove-colour', colour);
      }
  }
}
</script>

<style scoped lang="less">
ul {
    margin: 0;
    padding: 0;
}
.colour {
    display: block;
    position: relative;
}
</style>