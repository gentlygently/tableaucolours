<script setup>
import { computed, ref, watch } from 'vue'
import { parseTpsFile } from '@/utils/TpsParser'
import { useTpsFileStore } from '@/stores/tpsfile'
import ModalPanel from './ModalPanel/ModalPanel.vue'
import TpsFileErrors from './TpsFileErrors.vue'

const label = ref(null)
const fileInput = ref(null)
const parserErrors = ref(null)
const hasParserErrors = computed(() => parserErrors.value !== null)
const tpsStore = useTpsFileStore()

const selectFile = () => label.value.click()

function fileSelected(event) {
  const files = event.target.files

  if (!files || !files.length) return

  const reader = new FileReader()

  reader.onload = function (e) {
    const fileName = files[0].name
    const fileContents = e.target.result
    const result = parseTpsFile(fileContents)

    if (!result.isValid) {
      parserErrors.value = { fileName, errors: result.validationMessages }
      fileInput.value.value = null
      tpsStore.close()
      return
    }

    tpsStore.open(fileName, fileContents, result.palettes)
  }

  reader.readAsText(files[0])
}

const isFileOpen = computed(() => tpsStore.isOpen)

watch(isFileOpen, isOpen => {
  if (!isOpen) fileInput.value.value = null
})

defineExpose({ selectFile })
</script>

<template>
  <div class="tpsfileopen">
    <label ref="label" for="selecttps">
      <input ref="fileInput" id="selecttps" type="file" accept=".tps" @input="fileSelected" />
    </label>
  </div>
  <ModalPanel :show="hasParserErrors" width="54rem" @close="parserErrors = null">
    <TpsFileErrors
      v-if="hasParserErrors"
      :errors="parserErrors.errors"
      :fileName="parserErrors.fileName"
      @close="parserErrors = null"
    />
  </ModalPanel>
</template>

<style scoped lang="less">
.tpsfileopen {
  display: none;
}
</style>
