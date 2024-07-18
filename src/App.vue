<script setup>
import { computed } from 'vue'
import StartMenu from '@/components/StartMenu.vue'
import ColourPaletteEditor from '@/components/ColourPaletteEditor.vue'
import TpsEditor from '@/components/TpsEditor.vue'
import { usePaletteStore } from '@/stores/palette'
import { useTpsFileStore } from '@/stores/tpsfile'

const paletteStore = usePaletteStore()
const tpsStore = useTpsFileStore()

const isStartMenuOpen = computed(() => !tpsStore.isOpen && !paletteStore.isOpen)
</script>

<template>
  <Transition name="overlay">
    <section id="startmenu" class="overlay" v-if="isStartMenuOpen">
      <StartMenu />
    </section>
  </Transition>
  <section id="sidebar">
    <section id="tpssection">
      <TpsEditor />
    </section>
  </section>
  <Transition name="overlay">
    <section id="palettesection" class="overlay" v-if="paletteStore.isOpen">
      <ColourPaletteEditor />
    </section>
  </Transition>
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
#tpssection {
  width: 25rem;
  height: 100%;
  background-color: @background-colour;
  border-right: @border;
}

.overlay {
  display: flex;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.95);
  transition: opacity 0.5s ease;

  &-enter-from {
    opacity: 0;
  }

  &-leave-active {
    opacity: 0;
  }

  &-enter-from > * {
    transform: scale(1.1);
  }

  &-leave-active > * {
    transform: scale(0);
  }
}

button.button {
  border: none;
  outline: none;
  padding: 0.5rem;
  font-size: 1.5rem;
  color: #fff;
  background-color: @button-colour;
  text-align: center;

  &:hover {
    background-color: @button-colour-hover;
  }
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
