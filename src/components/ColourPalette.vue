<template>
    <div>
        <div class="palette-name">
            <input type="text" v-model="palette.name" />
        </div>
        <colour-list 
            :colours="palette.colours"
            @select-colour="selectColour"
            @remove-colour="removeColour" />
        <div class="palette-actions">
            <a @click="add" class="button add fas fa-plus" title="Add colour" @click.prevent.stop></a>
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
      },
      removeColour (colour) {
          this.$emit('remove-colour', colour);
      }
  }
}
</script>

<style scoped lang="less">
@import "./../variables.less";

.palette-name {
    border-bottom: @border;
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
        border: @border;
    }
}
.palette-actions {
    box-sizing: border-box;
    height: 3rem;
    border-bottom: @border;

    .add {
        display: block;
        float: right;
        width: 3rem;
        border-left: @border;
        text-align: center;
        font-size: 2rem;
        line-height: 2.9rem;
    }
}

</style>