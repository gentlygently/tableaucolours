<script setup>
import ColourPalette from './ColourPalette.vue'

const props = defineProps({ tpsEditorOpen: Boolean })
const emit = defineEmits(['open-tps-editor-click'])

function openTpsEditor() {
  emit('open-tps-editor-click')
}
</script>

<template>
  <div class="editor">
    <div class="palette">
      <ColourPalette />
    </div>
    <div class="menu">
      <button
        class="opentpseditor"
        title="Open TPS file..."
        :disabled="props.tpsEditorOpen"
        @click.prevent.stop="openTpsEditor"
      >
        <span class="fas fa-file-code"></span> Open TPS File
      </button>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '../variables.less';

.editor {
  display: flex;
  flex-flow: column nowrap;
  align-items: start;
  align-content: space-between;
  width: 100%;
  height: 100%;
}

.editor > * {
  width: 100%;
}

.palette {
  margin-top: 4rem;
  margin-bottom: auto;
}

.menu {
  align-self: flex-end;
  margin-top: auto;
  margin-bottom: 2rem;
}

.opentpseditor {
  font-size: 1.4rem;
  vertical-align: middle;
  position: relative;
  border: 0;
  background-color: transparent;
  margin-left: 1.5rem;

  span {
    display: inline-block;
    font-size: 1.7rem;
    color: @button-colour;
    text-align: center;
    width: 2rem;
  }
}
</style>
