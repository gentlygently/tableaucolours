<script setup>
import { ref } from 'Vue'
import TpsFileOpen from './TpsFileOpen.vue'

const fileSelector = ref(null)
const selectedFileName = ref('')

const emit = defineEmits(['open-palette-click'])

function openPaletteClick() {
  emit('open-palette-click')
}

function selectFile() {
  fileSelector.value.selectFile()
}

function fileSelected(files) {
  if (!files || !files.length) {
    return
  }
  selectedFileName.value = files[0].name
}

defineExpose({ selectFile })
</script>

<template>
  <div class="tpseditor">
    <div class="tpseditor-toolbar"></div>
    <div class="tpseditor-file">
      <TpsFileOpen ref="fileSelector" :selectedFileName="selectedFileName" @file-selected="fileSelected" />
    </div>
    <div class="tpseditor-standalone">
      <button class="openpalette" @click.stop.prevent="openPaletteClick">Create standalone palette</button>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '../variables.less';

.tpseditor {
  &-toolbar {
    height: 4rem;
    width: 100%;
    box-sizing: border-box;
    padding: 1rem;
  }
  &-close {
    font-size: 2rem;
    vertical-align: middle;
    position: relative;
  }
  &-file {
    padding: 1rem;
  }
}
.openpalette {
  border: none;
  outline: none;
  padding: 0.5rem;
  font-size: 1.5rem;
  color: #fff;
  background-color: @button-colour;
  text-align: center;
  width: 20rem;
  margin-top: 1rem;
  margin-left: 2.5rem;

  &:hover {
    background-color: @button-colour-hover;
  }
}
</style>
