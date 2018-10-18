<template>
    <div>
        <div>
            <input type="text" v-model="palette.name" />
        </div>
        <colour-list :colours="palette.colours" />
    </div>
</template>

<script>
import ColourList from './ColourList.vue'

export default {
  name: 'ColourPalette',
  props: {
    //msg: String
  },
  props: {
      palette: {
          type: Object,
          required: true
      }
  },
  components: {
      ColourList
  }
}
</script>

<style scoped lang="less">
input { 
    width: 100%; 
    margin-bottom: 1rem;
    box-sizing: border-box;
    line-height: 1.5rem;
}
</style>