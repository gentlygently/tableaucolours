<script setup>
import { ref } from 'vue'
import ColourPaletteHelp from '@/components/ColourPaletteHelp.vue'
import TpsFileHelp from '@/components/TpsFileHelp.vue'
import ModalPanel from './ModalPanel.vue'
import { usePaletteStore } from '@/stores/palette'
import { useTpsFileStore } from '@/stores/tpsfile'

const paletteStore = usePaletteStore()
const tpsStore = useTpsFileStore()
const modalOpen = ref(false)
</script>

<template>
  <div class="help">
    <button
      v-if="paletteStore.isOpen || tpsStore.isOpen"
      class="help-button"
      title="Help"
      @click.prevent.stop="modalOpen = true"
    >
      ?
    </button>
    <ModalPanel :show="modalOpen" full width="70rem" @close="modalOpen = false">
      <ColourPaletteHelp v-if="paletteStore.isOpen" class="help-content" />
      <TpsFileHelp v-if="tpsStore.isOpen && !paletteStore.isOpen" class="help-content" />
    </ModalPanel>
  </div>
</template>

<style lang="less">
@import '../variables.less';
.help {
  height: 4rem;
  &-button {
    width: 4rem;
    height: 4rem;
    border: solid 0.1rem #fff;
    border-radius: 2rem;
    font-size: 3rem;
    display: block;
    color: #fff;
    float: right;
    background-color: transparent;

    &:hover {
      border-width: 0.2rem;
    }
  }
  h1 {
    font-size: 1.8rem;
    margin: 0;
    padding: 0;
  }
  h2 {
    font-size: 1.6rem;
    margin: 0;
    padding: 0;
    margin-block-start: 1rem;
    margin-block-end: 0;
  }
  ul,
  ol {
    margin-block-start: 0rem;
    margin-block-end: 0.5rem;
  }
  p {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
  .fas {
    padding: 0 0.3rem;
  }
}
</style>
