<script setup>
import { ref } from 'vue'

const props = defineProps({ selectedFileName: String })
const emit = defineEmits(['file-selected'])
const label = ref(null)

function click() {
  label.value.click()
}

function input(event) {
  emit('file-selected', event.target.files)
}

defineExpose({ selectFile: click })
</script>

<template>
  <div class="tpsfileopen">
    <input :value="props.selectedFileName" type="text" readonly />
    <label ref="label" for="selecttps">
      <input id="selecttps" type="file" accept=".tps" style="display: none" @input="input" />
      <button
        class="tpsfileopen--button iconbutton fas fa-folder-open"
        title="Open TPS file..."
        @click.prevent="click"
      ></button>
    </label>
  </div>
</template>

<style scoped lang="less">
@import '../variables.less';

.tpsfileopen {
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  align-content: stretch;
  border: @border;
  background-color: #fff;
  border-radius: 0.2rem;
  box-sizing: border-box;
  outline: none;
  box-shadow: @box-shadow;

  input {
    flex-grow: 1;
    width: 100%;
    padding: 0.5rem;
    font-size: 1.5rem;
    border: 0;
  }
  label {
    width: 2.8rem;
    padding-top: 0.4rem;
    padding-right: 0.5rem;
    flex-shrink: 0;
    flex-grow: 0;
    text-align: right;
  }
  &--button {
    font-size: 1.8rem;
    vertical-align: middle;
    position: relative;
  }
}
</style>
