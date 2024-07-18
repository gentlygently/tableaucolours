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
  <Transition name="overlay">
    <section id="palettesection" class="overlay" v-if="paletteStore.isOpen">
      <div>
        <ColourPaletteEditor />
      </div>
    </section>
  </Transition>
  <section id="tpssection" v-if="tpsStore.isOpen">
    <div>
      <TpsEditor />
    </div>
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
  background-color: @background-colour;
}

#startmenu {
  background-color: rgba(0, 0, 0, 0.7);
}

#palettesection {
  z-index: 1000;

  > div {
    margin: auto;
    width: max(75rem, 80%);
    min-width: 75rem;
    max-width: 80%;
    height: max(55rem, 80%);
    min-height: 55rem;
    max-height: 100rem;
    border-radius: 0.2rem;
    overflow: hidden;
  }
}

#tpssection {
  display: flex;

  width: 100%;
  height: 100%;

  > div {
    margin: auto;
    width: 75rem;
    min-height: 55rem;
    max-height: 80%;
    height: max(55rem, 80%);
    background-color: #fff;
    border-radius: 0.2rem;
    padding: 2.5rem;
    box-shadow: @box-shadow;
  }
}

.overlay {
  display: flex;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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
  border-radius: 0.2rem;
  outline: none;
  padding: 0.5rem;
  font-size: 1.5rem;
  color: #fff;
  background-color: @button-colour;
  text-align: center;

  &:hover {
    background-color: @button-colour-hover;
  }

  &:disabled {
    background-color: @button-colour-disabled;
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
