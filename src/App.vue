<template>
  <main id="app">
    <section id="palettesection">
      <colour-palette/>
    </section>
    <section id="imagesection">
      <image-colour-picker :can-pick-colour="canPickColour" @colour-picked="colourPicked"/>
    </section>
  </main>
</template>

<script>
import ColourPalette from './components/ColourPalette.vue'
import ImageColourPicker from './components/ImageColourPicker.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  components: {
    ColourPalette,
    ImageColourPicker
  },
  computed: {
    ...mapGetters({
      selectedColour: 'palette/selectedColour'
    }),
    canPickColour () {
      return !!this.selectedColour
    }
  },
  methods: {
    colourPicked (hex) {
      this.$store.dispatch('palette/updateSelectedColour', { hex })
    }
  }
}
</script>

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
</style>
