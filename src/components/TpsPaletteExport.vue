<script setup>
import { computed, ref } from 'vue'
import { useTpsFileStore } from '@/stores/tpsfile'

const emit = defineEmits(['export'])
const tpsStore = useTpsFileStore()
const fileName = ref('')
const canExport = computed(() => fileName.value && tpsStore.hasSelectedPalettes)

const buttonTitle = computed(() => {
  if (!tpsStore.hasSelectedPalettes) return 'Select one or more palettes for export'
  if (!fileName.value) return 'Enter a name for the new settings file'

  const count = tpsStore.selectedPalettes.length

  return `Save ${count == 1 ? 'selected palette' : `${count} palettes`} to ${fileName.value}`
})

function click() {
  let name = fileName.value.trim()

  if (!name.toLocaleLowerCase().endsWith('.tps')) name += '.tps'

  emit('export', name)
}
</script>

<template>
  <div class="paletteexport">
    <input type="text" v-model="fileName" placeholder="Enter file name" />
    <button class="button" :disabled="!canExport" :title="buttonTitle" @click.stop.prevent="click">Export</button>
  </div>
</template>

<style scoped lang="less">
@import '../variables.less';

.paletteexport {
  padding: 1rem;

  input[type='text'] {
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
  button {
    margin-top: 1rem;
    display: block;
    font-size: 1.4rem;
    padding: 0.3rem;
    box-sizing: border-box;
    width: 100%;
  }
}
</style>
