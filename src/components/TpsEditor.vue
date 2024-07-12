<script setup>
import { ref } from 'Vue'
import TpsFileOpen from './TpsFileOpen.vue'

const fileSelector = ref(null)
const selectedFileName = ref('')

/*
const emit = defineEmits(['closed'])


function close() {
  emit('closed')
}
  */
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
    <div class="tpseditor-file">
      <TpsFileOpen ref="fileSelector" :selectedFileName="selectedFileName" @file-selected="fileSelected" />
    </div>
  </div>
</template>

<style scoped lang="less">
.tpseditor {
  &-file {
    padding: 1rem;
  }
}
</style>
