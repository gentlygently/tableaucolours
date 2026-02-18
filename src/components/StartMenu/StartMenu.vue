<script setup>
import { ref } from 'vue'
import { usePaletteStore } from '@/stores/palette'
import TpsFileOpen from '../TpsFileOpen.vue'

const openTpsFile = ref(null)
const openTpsFileEditor = () => openTpsFile.value.selectFile()

const paletteStore = usePaletteStore()
const openPaletteEditor = () => paletteStore.open()
</script>

<template>
  <div class="startmenu">
    <div class="function">
      <h2>Manage Preferences.tps</h2>
      <p>
        Open a Preferences.tps file to add, clone, edit, remove, and re-order your Tableau colour
        palettes. If you're a real palette hoarder, you can select palettes for export into a new
        .tps file.
      </p>
      <div class="action">
        <button class="button" @click.stop.prevent="openTpsFileEditor">Open file...</button>
      </div>
    </div>
    <div class="function">
      <h2>Create a colour palette</h2>
      <p>
        Create a new Tableau colour palette from scratch, either by magically extracting colours
        from an image or picking them yourself. You can also import and edit existing palettes.
      </p>
      <div class="action">
        <button class="button" @click.stop.prevent="openPaletteEditor">Create a template</button>
      </div>
    </div>
  </div>
  <TpsFileOpen ref="openTpsFile" />
</template>

<style scoped lang="less">
@import '../../variables.less';

.startmenu {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;

  .function {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: auto 20rem;
    gap: 0.5rem 2rem;

    &:first-of-type {
      padding-bottom: 3rem;
      margin-bottom: 3rem;
      border-bottom: 0.1rem solid @border-colour;
    }

    h2 {
      grid-row: 1;
      grid-column: 1 / span 2;
      font-size: 2.2rem;
      font-weight: bold;
      margin: 0;
      padding: 0;
    }

    p {
      grid-column: 1;
      grid-row: 2;
      font-size: 1.8rem;
      margin: 0;
      padding: 0;
    }

    .action {
      grid-row: 2;
      grid-column: 2;

      button {
        display: block;
        width: 20rem;
        font-size: 1.8rem;
        padding: 1rem;
      }
    }
  }
}
</style>
