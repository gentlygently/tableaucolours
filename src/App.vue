<script setup>
import { computed } from 'vue'
import AppHelp from '@/components/AppHelp.vue'
import StartMenu from '@/components/StartMenu.vue'
import ColourPaletteEditor from '@/components/ColourPaletteEditor.vue'
import TpsFileEditor from '@/components/TpsFileEditor.vue'
import { usePaletteStore } from '@/stores/palette'
import { useTpsFileStore } from '@/stores/tpsfile'

const paletteStore = usePaletteStore()
const tpsStore = useTpsFileStore()

const isStartMenuOpen = computed(() => !tpsStore.isOpen && !paletteStore.isOpen)
</script>

<template>
  <div id="modals"></div>
  <header>
    <div>
      <div class="header-title">
        <h1>Gently, gently</h1>
        <div class="description">Tableau colour palette editor</div>
      </div>
      <div class="header-help"><AppHelp /></div>
    </div>
  </header>
  <main>
    <Transition name="overlay">
      <section id="startmenu" v-if="isStartMenuOpen">
        <StartMenu />
      </section>
    </Transition>
    <Transition name="overlay">
      <section id="palettesection" v-if="paletteStore.isOpen">
        <div>
          <div><ColourPaletteEditor /></div>
        </div>
      </section>
    </Transition>
    <section id="tpssection" v-if="tpsStore.isOpen">
      <div>
        <div><TpsFileEditor /></div>
      </div>
    </section>
  </main>
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
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 6rem calc(100% - 6rem);
  height: 100%;
  box-sizing: border-box;
  position: relative;
  background-color: @background-colour;
}

#modals {
  height: 0;
}

header {
  grid-row: 1;
  grid-column: 1;
  width: 100%;
  height: 6rem;
  background-image: linear-gradient(#ff4433, #ff5f15);
  z-index: 2;

  > div {
    width: clamp(75rem, 80%, 140rem);
    min-width: 75rem;
    max-width: min(80%, 140rem);
    color: #fff;
    margin: auto;
    padding-bottom: 0.8rem;
    display: grid;
    grid-template-columns: min-content auto;
    grid-template-rows: auto;

    .header-title {
      grid-column: 1;
      display: inline-block;
      text-align: center;
      text-wrap: nowrap;

      h1 {
        font-family: Antonio, sans-serif;
        font-size: 3rem;
        font-weight: bold;
        display: block;
        margin: 0;
        padding: 0;
      }
      .description {
        margin: 0;
        padding: 0;
        font-size: 1.2rem;
      }
    }

    .header-help {
      display: block;
      grid-column: 2;
      padding-top: 1.5rem;
    }
  }
}

main {
  grid-column: 1;
  grid-row: 2;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

#palettesection {
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-top: 2.5rem;

  > div {
    width: 100%;
    height: 100%;
    background-color: @background-colour;

    > div {
      margin: auto;
      width: clamp(75rem, 80%, 140rem);
      min-width: 75rem;
      max-width: min(80%, 140rem);
      height: clamp(60rem, 90%, 110rem);
      min-height: 60rem;
      max-height: min(90%, 110rem);
      border-radius: 0.2rem;
      box-shadow: @box-shadow;
      background-color: #fff;
      overflow: hidden;
    }
  }
}

#tpssection {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-top: 2.5rem;

  > div {
    width: 100%;
    height: 100%;

    > div {
      margin: auto;
      width: 75rem;
      height: max(60rem, 90%);
      min-height: 60rem;
      max-height: 90%;
      background-color: #fff;
      border-radius: 0.2rem;
      padding: 2.5rem;
      box-shadow: @box-shadow;
      box-sizing: border-box;
    }
  }
}

#startmenu {
  width: 100%;
  height: 100%;

  > div {
    margin: auto;
    margin-top: 8rem;
    width: 75rem;
    height: 40rem;
    background-color: #fff;
    border-radius: 0.2rem;
    padding: 2.5rem;
    box-shadow: @box-shadow;
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
