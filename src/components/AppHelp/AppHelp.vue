<script setup>
import { ref } from 'vue'
import ColourPaletteHelp from '@/components/ColourPaletteHelp/ColourPaletteHelp.vue'
import TpsFileHelp from '@/components/TpsFileHelp/TpsFileHelp.vue'
import ModalPanel from '../ModalPanel/ModalPanel.vue'
import { usePaletteStore } from '@/stores/palette'
import { useTpsFileStore } from '@/stores/tpsfile'
import { AppHelpTestIds } from '@/test-ids/AppHelpTestIds'

const paletteStore = usePaletteStore()
const tpsStore = useTpsFileStore()
const modalOpen = ref(false)
</script>

<template>
  <div class="help">
    <button
      v-if="paletteStore.isOpen || tpsStore.isOpen"
      class="help-button"
      :data-testid="AppHelpTestIds.Button"
      title="Help"
      @click.prevent.stop="modalOpen = true"
    >
      ?
    </button>
    <ModalPanel :show="modalOpen" full width="70rem" @close="modalOpen = false">
      <ColourPaletteHelp v-if="paletteStore.isOpen" class="help-content" :data-testid="AppHelpTestIds.Content" />
      <TpsFileHelp v-if="tpsStore.isOpen && !paletteStore.isOpen" class="help-content" :data-testid="AppHelpTestIds.Content" />
    </ModalPanel>
  </div>
</template>

<style lang="less">
@import '../../variables.less';
.help {
  height: 3rem;
  &-button {
    width: 3rem;
    height: 3rem;
    border: solid 0.1rem #fff;
    border-radius: 1.5rem;
    font-size: 2rem;
    display: block;
    color: #fff;
    float: right;
    background-color: transparent;

    &:hover {
      background-color: #ff000099;
    }
  }
  &-content {
    font-size: 1.4rem;
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
}
</style>
