<template>
    <span class="colourswatch" v-bind:style="{ 'background-color': colour }">&nbsp;</span>
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
@import "../variables.less";

.colourswatch {
    display: inline-block;
    width: 100%;
    height: 100%;
    border: @border;
    border-radius: 50%;
}
</style>