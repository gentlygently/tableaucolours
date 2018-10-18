<template>
    <ul>
        <Colour 
            v-for="colour in colours" 
            :key="colour.id"
            :colour="colour"
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