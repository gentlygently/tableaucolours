<script setup>
import { computed, ref } from 'vue'
import ColourPalette from '@/components/ColourPalette.vue'
import ImageColourPicker from '@/components/ImageColourPicker.vue'
import TpsEditor from '@/components/TpsEditor.vue'
import { usePaletteStore } from '@/stores/palette'

const store = usePaletteStore()

const tpsEditor = ref(null)
const tpsEditorOpen = ref(false)
const canPickColour = computed(() => !!store.selectedColour)

const colourPicked = hex => store.updateSelectedColour(hex)

function openTpsFile() {
  tpsEditorOpen.value = true
  tpsEditor.value.selectFile()
}
</script>

<template>
  <section id="sidebar">
    <section id="palettesection">
      <ColourPalette :tpsEditorOpen="tpsEditorOpen" @open-tps-editor-click="openTpsFile" />
    </section>
    <Transition name="tps">
      <section id="tpssection" v-show="tpsEditorOpen">
        <TpsEditor ref="tpsEditor" @close="tpsEditorOpen = false" />
      </section>
    </Transition>
  </section>
  <section id="imagesection">
    <ImageColourPicker :can-pick-colour="canPickColour" @colour-picked="colourPicked" />
  </section>
</template>

<style lang="less">
@import './variables.less';

html,
body {
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
  font-size: 10px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

input,
select,
textarea {
  font-size: 1rem;
}

#app {
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  align-content: stretch;
  height: 100%;
  box-sizing: border-box;
  position: relative;
}
#sidebar {
  position: relative;
  flex-shrink: 0;
  flex-grow: 0;
}
#sidebar,
#tpssection,
#palettesection {
  width: 25rem;
  height: 100%;
  background-color: @background-colour;
  border-right: @border;
}
#tpssection {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 200;
}
.tps-enter-active {
  animation: slide-in 0.3s;
}
.tps-leave-active {
  animation: slide-in 0.3s reverse;
}
@keyframes slide-in {
  0% {
    top: 100%;
  }
  100% {
    top: 0;
  }
}
#imagesection {
  height: 100%;
  box-sizing: border-box;
  position: relative;
  flex-grow: 1;
  overflow: hidden;
}
.iconbutton {
  color: @tool-colour;
  text-decoration: none;
  margin: 0;
  border: none;
  padding: 0;
  display: inline-block;
  vertical-align: middle;
  background-color: transparent;
  font-size: 1rem;
  outline: none;

  &:hover {
    color: @tool-colour-hover;
  }

  &:disabled,
  &:disabled:hover {
    color: @tool-colour-disabled;
  }

  &:active {
    color: @tool-colour-active;
  }
}
</style>
