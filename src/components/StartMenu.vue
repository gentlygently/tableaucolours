<script setup>
import { ref } from 'vue'
import { usePaletteStore } from '@/stores/palette'
import TpsFileOpen from './TpsFileOpen.vue'

const openTpsFile = ref(null)
const openTpsFileEditor = () => openTpsFile.value.selectFile()

const paletteStore = usePaletteStore()
const openPaletteEditor = () => paletteStore.open()
</script>

<template>
  <div class="startmenu">
    <button class="button" @click.stop.prevent="openTpsFileEditor">Edit Tableau settings file</button>
    <button class="button" @click.stop.prevent="openPaletteEditor">Create standalone palette</button>
  </div>
  <TpsFileOpen ref="openTpsFile" />
</template>

<style scoped lang="less">
@import '../variables.less';

.startmenu {
  margin: auto;

  > button {
    display: block;
    margin: 2.5rem;
    width: 30rem;
    font-size: 1.8rem;
    padding: 1rem;
  }
}
</style>
