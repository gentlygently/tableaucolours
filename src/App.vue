<script setup>
import { computed, ref } from 'vue'
import ColourPalette from '@/components/ColourPalette.vue'
import ImageColourPicker from '@/components/ImageColourPicker.vue'
import TpsEditor from '@/components/TpsEditor.vue'
import { usePaletteStore } from '@/stores/palette'

const store = usePaletteStore()

const paletteOpen = ref(false)
const canPickColour = computed(() => paletteOpen.value && !!store.selectedColour)

const colourPicked = hex => store.updateSelectedColour(hex)

function openColourPalette() {
  paletteOpen.value = true
}

function closeColourPalette() {
  paletteOpen.value = false
}
</script>

<template>
  <section id="sidebar">
    <section id="tpssection">
      <TpsEditor ref="tpsEditor" @open-palette-click="openColourPalette" />
    </section>
    <Transition name="palette">
      <section id="palettesection" v-show="paletteOpen">
        <ColourPalette @close="closeColourPalette" />
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
#palettesection {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 200;
}

.palette-enter-active {
  animation: slide-in 0.3s;
}
.palette-leave-active {
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
