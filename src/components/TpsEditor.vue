<script setup>
import { ref, computed } from 'vue'
import { usePaletteStore } from '@/stores/palette'
import { parseFile } from './TpsParser'
import ModalPanel from './ModalPanel.vue'
import TpsErrors from './TpsErrors.vue'
import TpsFileOpen from './TpsFileOpen.vue'
import TpsPaletteList from './TpsPaletteList.vue'

const store = usePaletteStore()
const fileName = ref('')
const palettes = ref([])
const parserErrors = ref(null)
const hasParserErrors = computed(() => parserErrors.value !== null)
const isFilOpen = computed(() => fileName.value.length > 0)

function openPaletteClick() {
  store.open()
}

let nextPaletteId = 1

function fileSelected(files) {
  fileName.value = ''
  palettes.value = []

  if (!files || !files.length) {
    return
  }

  const reader = new FileReader()

  reader.onload = function (event) {
    const result = parseFile(event.target.result)

    if (!result.isValid) {
      parserErrors.value = { fileName: files[0].name, errors: result.validationMessages }
      return
    }

    fileName.value = files[0].name
    palettes.value = result.palettes.map(x => ({ ...x, id: nextPaletteId++, isSelected: false }))
  }

  reader.readAsText(files[0])
}

const paletteSelected = palette => palettes.value.forEach(x => (x.isSelected = x === palette))
</script>

<template>
  <div class="tpseditor">
    <div class="toolbar"></div>
    <div class="file">
      <TpsFileOpen :selectedFileName="fileName" @file-selected="fileSelected" />
    </div>
    <div class="palettes" v-if="isFilOpen">
      <TpsPaletteList :palettes="palettes" @palette-selected="paletteSelected" />
    </div>
    <div class="standalone">
      <button class="openpalette" @click.stop.prevent="openPaletteClick">Create standalone palette</button>
    </div>
    <ModalPanel :show="hasParserErrors" width="54rem" @close="parserErrors = null">
      <TpsErrors :errors="parserErrors.errors" :fileName="parserErrors.fileName" @close="parserErrors = null" />
    </ModalPanel>
  </div>
</template>

<style scoped lang="less">
@import '../variables.less';

.tpseditor {
  &-close {
    font-size: 2rem;
    vertical-align: middle;
    position: relative;
  }
}
.toolbar {
  height: 4rem;
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
}
.file {
  padding: 1rem;
}
.palettes {
  padding: 0 1rem;
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
