<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { eventBus } from '@/eventbus'

const emit = defineEmits(['file-selected'])
const label = ref(null)

function input(event) {
  emit('file-selected', event.target.files)
}

function click() {
  label.value.click()
}

onMounted(() => eventBus.on('open-image-file', click))
onUnmounted(() => eventBus.off('open-image-file', click))
</script>

<template>
  <div class="imagefileopen">
    <label ref="label" for="selectImage">
      <input id="selectImage" type="file" accept="image/*" style="display: none" @input="input" />
      <button
        class="imagefileopen--button iconbutton fas fa-folder-open"
        title="Open image..."
        @click.prevent="click"
      ></button>
    </label>
  </div>
</template>

<style scoped lang="less">
.imagefileopen {
  &--button {
    font-size: 2rem;
    vertical-align: middle;
    top: -0.2rem;
    position: relative;
  }
}
</style>
