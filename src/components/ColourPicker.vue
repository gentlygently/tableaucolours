<template>
    <span>{{ colour }}</span>
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
span {
    font-size: 1.3rem;
}
</style>