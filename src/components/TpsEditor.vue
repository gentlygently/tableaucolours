<script setup>
import { ref } from 'Vue'
import TpsFileOpen from './TpsFileOpen.vue'

const fileSelector = ref(null)
const selectedFileName = ref('')

const emit = defineEmits(['close'])

function close() {
  selectedFileName.value = ''
  emit('close')
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
    <div class="tpseditor-toolbar">
      <button
        class="tpseditor-close iconbutton fas fa-times"
        title="Close TPS file"
        @click.prevent.stop="close"
      ></button>
    </div>
    <div class="tpseditor-file">
      <TpsFileOpen ref="fileSelector" :selectedFileName="selectedFileName" @file-selected="fileSelected" />
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
    border-bottom: @border;
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
</style>
