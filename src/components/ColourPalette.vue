<template>
    <div>
        <div class="palette-name">
            <input type="text" v-model="palette.name" />
        </div>
        <colour-list 
            :colours="palette.colours"
            @select-colour="selectColour" />
        <div class="palette-actions">
            <span @click="add" class="add fas fa-plus" title="Add colour"></span>
        </div>
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
  },
  methods: {
      add () {
          this.$emit('add-colour');
      },
      selectColour (colour) {
          this.$emit('select-colour', colour);
      }
  }
}
</script>

<style scoped lang="less">
.palette-name {
    border-bottom: solid 0.1rem #d8d5d3;
    padding: 1rem;
    box-sizing: border-box;
    height: 5rem;
    font-size: 2rem;

    input { 
        width: 100%; 
        border: none;
        background-color: transparent;
        font-weight: bold;
        font-size: 1.5rem;
    }
    input:focus {
        font-weight: normal;
        background-color: #fff;
        border: solid 0.1rem #d8d5d3;
    }
}
.palette-actions {
    box-sizing: border-box;
    height: 3rem;
    border-bottom: solid 0.1rem #d8d5d3;
    color: #73716f;

    .add {
        display: block;
        float: right;
        width: 3rem;
        border-left: solid 0.1rem #d8d5d3;
        text-align: center;
        font-size: 2rem;
        line-height: 2.9rem;
    }
}

</style>