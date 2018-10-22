<template>
    <span class="colourpicker">{{ colour }}</span>
</template>

<script>
export default {
  name: 'ColourPicker',
  props: {
    colour: {
        type: String,
        required: true
    }
  }
}
</script>

<style scoped lang="less">
.colourpicker {
    font-size: 1.3rem;
}
</style>