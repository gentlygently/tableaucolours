<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { eventBus } from '@/EventBus'

const props = defineProps({ selectedFileName: String, isFileOpen: Boolean })
const emit = defineEmits(['file-selected'])
const label = ref(null)
const fileInput = ref(null)

function click() {
  label.value.click()
}

function input(event) {
  if (event.target.files.length > 0) {
    emit('file-selected', event.target.files)
  }
}

const isFileOpen = computed(() => props.isFileOpen)

watch(isFileOpen, isOpen => {
  if (!isOpen) fileInput.value.value = null
})

onMounted(() => eventBus.on('open-tps-file', click))
onUnmounted(() => eventBus.off('open-tps-file', click))

defineExpose({ selectFile: click })
</script>

<template>
  <div class="tpsfileopen">
    <input :value="props.selectedFileName" type="text" placeholder="Select .tps file" readonly />
    <label ref="label" for="selecttps">
      <input ref="fileInput" id="selecttps" type="file" accept=".tps" style="display: none" @input="input" />
      <button
        class="tpsfileopen--button iconbutton fas fa-folder-open"
        title="Open .tps file..."
        @click.prevent="click"
      ></button>
    </label>
  </div>
</template>

<style scoped lang="less">
@import '../variables.less';

.tpsfileopen {
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  align-content: stretch;
  border: @border;
  background-color: #fff;
  border-radius: 0.2rem;
  box-sizing: border-box;
  outline: none;
  box-shadow: @box-shadow;

  input {
    flex-grow: 1;
    width: 100%;
    padding: 0.5rem;
    font-size: 1.5rem;
    border: 0;
  }
  label {
    width: 2.8rem;
    padding-top: 0.4rem;
    padding-right: 0.5rem;
    flex-shrink: 0;
    flex-grow: 0;
    text-align: right;
  }
  &--button {
    font-size: 1.8rem;
    vertical-align: middle;
    position: relative;
  }
}
</style>
