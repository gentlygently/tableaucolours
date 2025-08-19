<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  full: Boolean,
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
  <Teleport to="#modals">
    <dialog
      ref="dialog"
      :class="['modal', props.full ? 'modal--full' : '']"
      v-if="props.show"
      @mousedown="mouseDown"
    >
      <div class="modal-container" :style="{ width: props.width }" @click.stop>
        <button class="modal-close iconbutton fas fa-times" @click.stop.prevent="close"></button>
        <div class="modal-content">
          <slot></slot>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped lang="less">
@import '../variables.less';

.modal {
  overflow: hidden;
  max-height: 85%;

  &--full {
    height: 85%;

    & .modal-content {
      overflow-y: scroll;
    }
  }

  &-container {
    width: 30rem;
    height: 100%;
    max-height: 100%;
    margin: 0 auto;
    padding: 2rem;
    padding-top: 2.8rem;
    background-color: #fff;
    border-radius: 0.2rem;
    box-shadow: 0 0.2rem 0.8rem rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
  }

  &-close {
    position: absolute;
    top: 0.5rem;
    right: 0.6rem;
    font-size: 1.5rem;
  }

  &-content {
    height: min-content;
    max-height: 100%;
    overflow: hidden;
  }
}

/* Open state of the dialog  */
dialog {
  opacity: 0;
  transform: scaleY(0);
  transition: all 0.3s allow-discrete;
  border: 0;
  background-color: transparent;
}

dialog[open] {
  opacity: 1;
  transform: scaleY(1);
  border: 0;
  background-color: transparent;
}

/* Before open state  */
/* Needs to be after the previous dialog:open rule to take effect,
    as the specificity is the same */

@starting-style {
  dialog[open] {
    opacity: 0;
    transform: scaleY(1.1);
  }
}

/* Transition the :backdrop when the dialog modal is promoted to the top layer */
dialog::backdrop {
  background-color: rgba(0, 0, 0, 0);
  transition: all 0.3s allow-discrete;
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

/* This starting-style rule cannot be nested inside the above selector
because the nesting selector cannot represent pseudo-elements. */
@starting-style {
  dialog[open]::backdrop {
    background-color: rgb(0 0 0 / 0%);
  }
}
</style>
