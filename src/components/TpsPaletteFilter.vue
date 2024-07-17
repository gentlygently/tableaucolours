<script setup>
import { useTpsFileStore } from '@/stores/tpsfile'
import { PaletteTypes } from '@/PaletteTypes'

const tpsStore = useTpsFileStore()
</script>

<template>
  <ul class="palettefilter">
    <li class="name">
      <div class="label"><label>Name</label></div>
      <div class="input">
        <input id="palettefilter-name" type="text" v-model="tpsStore.paletteNameFilter" />
        <label
          ><input id="palettefilter-noname" type="checkbox" v-model="tpsStore.paletteNoNameFilter" /> No name</label
        >
      </div>
    </li>
    <li class="type">
      <div class="label"><label>Type</label></div>
      <div class="input">
        <label
          ><input type="checkbox" :value="PaletteTypes.regular.id" v-model="tpsStore.paletteTypeFilter" />
          {{ PaletteTypes.regular.name }}</label
        >
        <label
          ><input type="checkbox" :value="PaletteTypes.sequential.id" v-model="tpsStore.paletteTypeFilter" />
          {{ PaletteTypes.sequential.name }}</label
        >
        <label
          ><input type="checkbox" :value="PaletteTypes.diverging.id" v-model="tpsStore.paletteTypeFilter" />
          {{ PaletteTypes.diverging.name }}</label
        >
      </div>
    </li>
  </ul>
</template>

<style scoped lang="less">
@import '../variables.less';

.palettefilter {
  display: block;
  margin: 0;
  padding: 0;
  list-style: none;
  border: @border;
  border-radius: 0.5rem;
  font-size: 1.4rem;

  li {
    margin: 0;
    display: grid;
    grid-template-columns: 5rem auto;
    border-bottom: @border;
    padding: 1rem;
  }

  .label {
    grid-column: 1;
  }
  .input {
    grid-column: 2;

    & > input[type='text'] {
      width: 100%;
      border: @border;
      background-color: #fff;
      padding: 0.2rem;
      border-radius: 0.2rem;
      box-sizing: border-box;
      outline: none;
      font-size: 1.4rem;

      &:focus {
        box-shadow: @box-shadow-active;
      }
    }

    & > label {
      display: block;
    }
  }
}
</style>
