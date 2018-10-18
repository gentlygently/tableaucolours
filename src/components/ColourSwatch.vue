<template>
    <span v-bind:style="{ 'background-color': colour }">&nbsp;</span>
</template>

<script>
export default {
  name: 'ColourSwatch',
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
    display: inline-block;
    width: 100%;
    height: 100%;
    border: solid 0.1rem #d8d5d3;
    border-radius: 50%;
}
</style>