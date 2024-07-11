<script setup>
import { computed, ref } from 'vue'
import ColourPalette from '@/components/ColourPalette.vue'
import ImageColourPicker from '@/components/ImageColourPicker.vue'
import TpsEditor from '@/components/TpsEditor.vue'
import { usePaletteStore } from '@/stores/palette'

const store = usePaletteStore()

const tpsEditorOpen = ref(false)
const canPickColour = computed(() => !!store.selectedColour)

const colourPicked = hex => store.updateSelectedColour(hex)
</script>

<template>
  <Transition name="tps">
    <section id="tpssection" v-if="tpsEditorOpen">
      <TpsEditor @closed="tpsEditorOpen = false" />
    </section>
  </Transition>
  <section id="palettesection">
    <ColourPalette :tpsEditorOpen="tpsEditorOpen" @open-tps-editor-click="tpsEditorOpen = true" />
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
#tpssection {
  width: 25rem;
  height: 100%;
  position: relative;
  flex-shrink: 0;
  flex-grow: 0;
  background-color: @background-colour;
  border-right: @border;
}
#palettesection {
  width: 25rem;
  height: 100%;
  position: relative;
  flex-shrink: 0;
  flex-grow: 0;
  background-color: @background-colour;
  border-right: @border;
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
.tps-enter-active,
.tps-leave-active {
  animation: slide-in 0.5s;
}
@keyframes slide-in {
  0% {
    width: 0;
  }
  100% {
    width: 25rem;
  }
}
</style>
