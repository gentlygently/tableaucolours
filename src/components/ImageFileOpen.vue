<template>
    <div>
        <label for="selectImage">
            <input id="selectImage" type="file" style="display:none;" @input="input">
            <span class="fas fa-folder-open" title="Open image..."></span>
        </label>
    </div>
</template>

<script>
export default {
  name: 'ImageFileOpen',
  methods: {
      input (event) {
          this.$emit('file-selected', event.target.files);
      },
      submit () {

      }
  }
}
</script>

<style scoped lang="less">

</style>