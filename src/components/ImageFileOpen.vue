<template>
    <div>
        <label ref="label" for="selectImage">
            <input id="selectImage" type="file" style="display:none;" @input="input">
            <a class="button fas fa-folder-open" title="Open image..." @click.prevent="click" href="#"></a>
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
      click () {
          this.$refs.label.click();
      }
  }
}
</script>

<style scoped lang="less">

</style>