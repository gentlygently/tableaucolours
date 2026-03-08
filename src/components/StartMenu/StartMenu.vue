<script setup>
import { ref } from 'vue'
import { usePaletteStore } from '@/stores/palette'
import TpsFileOpen from '../TpsFileOpen/TpsFileOpen.vue'
import { StartMenuTestIds } from './StartMenuTestIds'

const openTpsFile = ref(null)
const openTpsFileEditor = () => openTpsFile.value.selectFile()

const paletteStore = usePaletteStore()
const openPaletteEditor = () => paletteStore.open()
</script>

<template>
  <div class="startmenu" :data-testid="StartMenuTestIds.Self">
    <div class="function">
      <div class="function-icon"><i class="fas fa-file-alt"></i></div>
      <div class="function-content">
        <h2>Manage Preferences.tps</h2>
        <p>
          Open a Preferences.tps file to add, clone, edit, remove, and re-order your Tableau colour
          palettes. If you're a real palette hoarder, you can select palettes for export into a new
          .tps file.
        </p>
      </div>
      <div class="action">
        <button
          class="button"
          :data-testid="StartMenuTestIds.OpenFile"
          @click.stop.prevent="openTpsFileEditor"
        >
          <i class="fas fa-folder-open"></i> Open file...
        </button>
      </div>
    </div>
    <div class="function">
      <div class="function-icon"><i class="fas fa-palette"></i></div>
      <div class="function-content">
        <h2>Create a colour palette</h2>
        <p>
          Create a new Tableau colour palette from scratch, either by magically extracting colours
          from an image or picking them yourself. You can also import and edit existing palettes.
        </p>
      </div>
      <div class="action">
        <button
          class="button"
          :data-testid="StartMenuTestIds.CreateTemplate"
          @click.stop.prevent="openPaletteEditor"
        >
          <i class="fas fa-plus"></i> Create a template
        </button>
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
  width: 75rem;
  margin: auto;
  padding-top: 8rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .function {
    display: grid;
    grid-template-columns: 5rem 1fr 20rem;
    gap: 0.5rem 2rem;
    align-items: center;
    background-color: #fff;
    border-radius: 0.4rem;
    padding: 3rem;
    box-shadow: @card-shadow;
    transition: box-shadow @transition-standard;

    &:hover {
      box-shadow: @card-shadow-hover;
    }

    .function-icon {
      grid-column: 1;
      grid-row: 1 / span 2;
      font-size: 3rem;
      color: rgba(115, 113, 111, 0.5);
      transition: color @transition-standard;
    }

    &:hover .function-icon {
      color: rgba(255, 77, 42, 0.7);
    }

    .function-content {
      grid-column: 2;
      grid-row: 1 / span 2;
    }

    h2 {
      font-size: 2rem;
      font-weight: 600;
      color: #333;
      margin: 0;
      padding: 0;
    }

    p {
      font-size: 1.4rem;
      line-height: 1.6;
      color: #73716f;
      margin: 0;
      padding: 0;
      margin-top: 0.5rem;
    }

    .action {
      grid-column: 3;
      grid-row: 1 / span 2;
      align-self: center;

      button {
        display: block;
        width: 20rem;
        font-size: 1.8rem;
        padding: 1rem;
        border-radius: 0.3rem;
        transition: box-shadow @transition-standard;

        i {
          margin-right: 0.5rem;
        }

        &:hover {
          box-shadow: 0 0.2rem 0.6rem rgba(43, 122, 230, 0.3);
        }
      }
    }
  }
}
</style>
