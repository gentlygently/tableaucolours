<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  width: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['close'])
const dialog = ref(null)

function close() {
  if (dialog.value) {
    dialog.value.close()
  }
  emit('close')
}

function keyUp(event) {
  if (
    event.target.tagName.toLowerCase() !== 'input' &&
    event.target.tagName.toLowerCase() !== 'textarea' &&
    event.key === 'Escape'
  ) {
    close()
  }
}

function mouseDown(event) {
  if (event.target === event.currentTarget) {
    close()
  }
}

watch(
  () => props.show,
  newValue => {
    if (newValue) dialog.value.showModal()
  },
  { flush: 'post' }
)

onMounted(() => window.addEventListener('keyup', keyUp, false))
onUnmounted(() => window.removeEventListener('keyup', keyUp))
</script>

<template>
  <dialog ref="dialog" v-if="props.show" @mousedown="mouseDown">
    <div class="modal-container" :style="{ width: props.width }" @click.stop>
      <button class="modal-close iconbutton fas fa-times" @click.stop.prevent="close"></button>
      <slot></slot>
    </div>
  </dialog>
</template>

<style scoped lang="less">
@import '../variables.less';

.modal {
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

/* Open state of the dialog  */
dialog:open {
  opacity: 1;
  transform: scaleY(1);
  border: 0;
  background-color: transparent;
}

/* Closed state of the dialog   */
dialog {
  opacity: 0;
  transform: scaleY(0);
  transition: all 0.3s allow-discrete;
}

/* Before open state  */
/* Needs to be after the previous dialog:open rule to take effect,
    as the specificity is the same */
@starting-style {
  dialog:open {
    opacity: 0;
    transform: scaleY(1.1);
  }
}

/* Transition the :backdrop when the dialog modal is promoted to the top layer */
dialog::backdrop {
  background-color: rgba(0, 0, 0, 0);
  transition: all 0.3s allow-discrete;
}

dialog:open::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

/* This starting-style rule cannot be nested inside the above selector
because the nesting selector cannot represent pseudo-elements. */
@starting-style {
  dialog:open::backdrop {
    background-color: rgb(0 0 0 / 0%);
  }
}
</style>
