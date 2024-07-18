<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  show: Boolean,
  width: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['close'])

const isMouseDownOnWrapper = ref(false)

const close = () => emit('close')

function keyUp(event) {
  if (event.target.tagName.toLowerCase() !== 'input' && event.key === 'Escape') {
    close()
  }
}

function wrapperMouseDown() {
  isMouseDownOnWrapper.value = true
}
function wrapperMouseLeave() {
  isMouseDownOnWrapper.value = false
}
function wrapperMouseUp() {
  if (isMouseDownOnWrapper.value) {
    isMouseDownOnWrapper.value = false
    close()
  }
}

onMounted(() => window.addEventListener('keyup', keyUp, false))
onUnmounted(() => window.removeEventListener('keyup', keyUp))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="props.show" class="overlay modal-mask">
        <div
          ref="wrapper"
          class="modal-wrapper"
          @mousedown.self="wrapperMouseDown"
          @mouseup.self="wrapperMouseUp"
          @mouseleave="wrapperMouseLeave"
        >
          <div class="modal-container" :style="{ width: props.width }" @click.stop>
            <button class="modal-close iconbutton fas fa-times" @click.stop.prevent="close"></button>
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="less">
@import '../variables.less';

.modal {
  &-mask {
    display: table;
    transition: opacity 0.3s ease;
  }

  &-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  &-container {
    width: 30rem;
    margin: 0 auto;
    padding: 2rem;
    padding-top: 2.5rem;
    background-color: #fff;
    border-radius: 0.2rem;
    box-shadow: 0 0.2rem 0.8rem rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    position: relative;
    box-sizing: border-box;
  }

  &-close {
    position: absolute;
    top: 0.3rem;
    right: 0.5rem;
    font-size: 1.5rem;
  }

  /*
    * The following styles are auto-applied to elements with
    * transition="modal" when their visibility is toggled
    * by Vue.js.
    *
    * You can easily play with the modal transition by editing
    * these styles.
    */

  &-enter-from {
    opacity: 0;
  }

  &-leave-active {
    opacity: 0;
  }

  &-enter-from .modal-container,
  &-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
}
</style>
