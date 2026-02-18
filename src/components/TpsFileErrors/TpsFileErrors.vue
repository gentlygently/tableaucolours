<script setup>
const props = defineProps(['errors', 'fileName'])
const emit = defineEmits(['close'])
</script>

<template>
  <div class="tpserrors">
    {{ fileName }} cannnot be edited due to errors:
    <ul>
      <li v-for="(e, i) in props.errors" :key="i">
        <span v-if="e.palette">In palette "{{ e.palette }}": </span>{{ e.message }}
      </li>
    </ul>
    <button @click.stop.prevent="emit('close')">OK</button>
  </div>
</template>

<style scoped lang="less">
@import '../../variables.less';

.tpserrors {
  font-size: 1.5rem;
  &:after {
    content: ' ';
    display: block;
    clear: both;
    width: 0;
    height: 0;
  }

  ul {
    width: 50rem;
    max-height: 30rem;
    margin: 0;
    margin-top: 1rem;
    margin-bottom: 2rem;
    padding-left: 2rem;
    overflow-x: auto;
    overflow-y: scroll;
  }

  button {
    border: none;
    outline: none;
    padding: 0.5rem;
    font-size: 1.5rem;
    color: #fff;
    background-color: @button-colour;
    text-align: center;
    width: 20rem;
    float: right;
    margin-top: 1rem;

    &:hover {
      background-color: @button-colour-hover;
    }
  }
}
</style>
