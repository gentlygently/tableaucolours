<script setup>
import { computed } from 'vue'
import AppHelp from '@/components/AppHelp/AppHelp.vue'
import StartMenu from '@/components/StartMenu/StartMenu.vue'
import ColourPaletteEditor from '@/components/ColourPaletteEditor/ColourPaletteEditor.vue'
import TpsFileEditor from '@/components/TpsFileEditor/TpsFileEditor.vue'
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
      <span class="brand-mark"></span>
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
  grid-template-rows: 7rem calc(100% - 7rem);
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
  height: 7rem;
  background-image: linear-gradient(135deg, #ff4433, #ff5f15);
  z-index: 2;
  position: relative;
  box-shadow:
    0 0.2rem 0.6rem rgba(0, 0, 0, 0.15),
    0 0.1rem 0 @header-accent;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    pointer-events: none;
  }

  > div {
    width: clamp(75rem, 80%, 140rem);
    min-width: 75rem;
    max-width: min(80%, 140rem);
    color: #fff;
    margin: auto;
    height: 100%;
    align-content: center;
    display: grid;
    grid-template-columns: min-content min-content auto;
    grid-template-rows: auto;
    gap: 0 1rem;

    .brand-mark {
      grid-column: 1;
      width: 0.3rem;
      height: 3.2rem;
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 0.15rem;
      align-self: center;
    }

    .header-title {
      grid-column: 2;
      display: inline-block;
      text-align: center;
      text-wrap: nowrap;

      h1 {
        font-family: Antonio, sans-serif;
        font-size: 3rem;
        font-weight: 400;
        letter-spacing: 0.05em;
        display: block;
        margin: 0;
        padding: 0;
      }
      .description {
        margin: 0;
        padding: 0;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        opacity: 0.85;
      }
    }

    .header-help {
      display: block;
      grid-column: 3;
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
  background: radial-gradient(ellipse at top center, rgba(0, 0, 0, 0.04) 0%, transparent 60%);
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
