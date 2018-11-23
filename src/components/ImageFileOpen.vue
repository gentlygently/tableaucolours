<template>
  <div class="imagefileopen">
    <label ref="label" for="selectImage">
      <input id="selectImage" type="file" style="display:none;" @input="input">
      <button
        class="imagefileopen--button iconbutton fas fa-folder-open"
        title="Open image..."
        @click.prevent="click"
      ></button>
    </label>
  </div>
</template>

<script>
import { EventBus } from '../eventbus.js'

export default {
  name: 'ImageFileOpen',
  methods: {
    input (event) {
      this.$emit('file-selected', event.target.files)
    },
    click () {
      this.$refs.label.click()
    }
  },
  created: function () {
    EventBus.$on('open-image-file', this.click)
  },
  destroyed: function () {
    EventBus.$off('open-image-file', this.click)
  }
}
</script>

<style scoped lang="less">
.imagefileopen {
  &--button {
    font-size: 2rem;
    vertical-align: middle;
    top: -0.2rem;
    position: relative;
  }
}
</style>
