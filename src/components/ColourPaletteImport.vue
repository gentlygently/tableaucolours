<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { usePaletteStore } from '@/stores/palette'
import { parseColourPalette } from '@/utils/TpsParser'

const store = usePaletteStore()

const emit = defineEmits(['close'])

const code = ref(null)
const xml = ref('')
const isValid = ref(false)
const validationMessage = ref('')
const palette = ref({})

const hasCode = computed(() => !!xml.value)
const hasValidationMessage = computed(() => !!validationMessage.value)
const codeClasses = computed(() => {
  const classes = []

  if (hasCode.value && !isValid.value) {
    classes.push('importcode-code--invalid')
  }

  if (hasValidationMessage.value) {
    classes.push('importcode-code--validationmessage')
  }

  return classes
})

function importXml() {
  store.replacePalette(palette.value.name, palette.value.type, palette.value.colours)
  emit('close')
}

watch(xml, newValue => {
  const result = parseColourPalette(newValue)

  isValid.value = result.isValid
  validationMessage.value = result.validationMessage
  palette.value = result.isValid ? result.palette : {}
})

onMounted(() => code.value.focus())
</script>

<template>
  <div class="importcode">
    <div class="importcode-codecontainer">
      <textarea
        ref="code"
        v-model.trim="xml"
        class="importcode-code"
        :class="codeClasses"
        placeholder="Paste a &lt;color-palette&gt;"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
      ></textarea>
      <div v-show="hasValidationMessage" class="importcode-validationmessage">{{ validationMessage }}</div>
    </div>
    <button class="importcode-button importcode-button--import" :disabled="!isValid" @click="importXml">Import</button>
    <button class="importcode-button importcode-button--cancel" @click="$emit('close')">Cancel</button>
  </div>
</template>

<style scoped lang="less">
@import '../variables.less';

.importcode {
  &:after {
    content: ' ';
    display: block;
    clear: both;
    width: 0;
    height: 0;
  }

  &-codecontainer {
    width: 50rem;
    height: 30rem;
  }

  &-code {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: @border;
    background-color: @background-colour;
    border-radius: 0.2rem;
    padding: 0.5rem;
    margin: 0;
    overflow: auto;
    font-size: 1.3rem;
    outline: none;
    transition: height 0.2s;

    &--invalid {
      border-color: #f00;
      background-color: #ff000010;
    }

    &--validationmessage {
      height: 28rem;
    }
  }

  &-validationmessage {
    color: #f00;
    font-size: 1.5rem;
    margin-top: 0.5rem;
    height: 2rem;
    box-sizing: border-box;
    transition: height 0.2s;
  }

  &-button {
    border: none;
    outline: none;
    padding: 0.5rem;
    font-size: 1.5rem;
    color: #fff;
    background-color: @button-colour;
    text-align: center;
    width: 15rem;
    float: right;
    margin-top: 1rem;
    margin-left: 1rem;

    &:hover {
      background-color: @button-colour-hover;
    }

    &:disabled {
      background-color: @button-colour-disabled;
    }
  }
}
</style>
