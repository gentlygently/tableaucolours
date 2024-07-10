<script setup>
import { ref } from 'vue'
import he from 'he'
import { usePaletteStore } from '@/stores/palette'

const store = usePaletteStore()

const copied = ref(false)
const code = ref(null)

function copy() {
  if (document.body.createTextRange) {
    const range = document.body.createTextRange()
    range.moveToElementText(code.value)
    range.select()
  } else if (window.getSelection) {
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(code.value)
    selection.removeAllRanges()
    selection.addRange(range)
  } else {
    console.log('Text selection not supported')
  }
  document.execCommand('copy')
  copied.value = true
}

function xml() {
  let x = `<color-palette name="${he.encode(store.name, {
    useNamedReferences: true,
  })}" type="${store.type}">\n`

  store.colours.forEach(c => (x += `    <color>${c.hex}</color>\n`))

  return x + '</color-palette>'
}
</script>

<template>
  <div class="getcode">
    <div class="getcode-codecontainer">
      <pre ref="code" class="getcode-code">{{ xml() }}</pre>
    </div>
    <transition mode="out-in">
      <button v-if="!copied" class="getcode-copy" @click.stop.prevent="copy">Copy to clipboard</button>
      <button v-else-if="copied" class="getcode-copy getcode-copy--copied" @click.stop.prevent="copy">
        Copied
        <span class="fas fa-check"></span>
      </button>
    </transition>
  </div>
</template>

<style scoped lang="less">
@import '../variables.less';

.getcode {
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
    font-size: 1.3rem;
    width: 100%;
    height: 100%;
    border: @border;
    background-color: @background-colour;
    border-radius: 0.2rem;
    padding: 0.5rem;
    margin: 0;
    overflow: auto;
  }
  &-copy {
    border: none;
    outline: none;
    padding: 0.5rem;
    font-size: 1.5rem;
    color: #fff;
    background-color: @button-colour;
    text-align: center;
    width: 20rem;
    float: right;
    margin-top: 1rem;

    &:hover {
      background-color: @button-colour-hover;
    }

    &--copied {
      background-color: @button-special-colour;

      &:hover {
        background-color: @button-special-colour-hover;
      }
    }
  }
}
</style>
