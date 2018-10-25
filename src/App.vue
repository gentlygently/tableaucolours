<template>
  <main id="app">
    <section id="palettesection">
      <colour-palette
        :palette="palette"
        @add-colour="addColour"
        @select-colour="selectColour"
        @remove-colour="removeColour"
        @discard-palette="discardPalette"
        @import-palette="importPalette"
      />
    </section>
    <section id="imagesection">
      <image-colour-picker :can-pick-colour="canPickColour" @colour-picked="colourPicked"/>
    </section>
  </main>
</template>

<script>
import ColourPalette from './components/ColourPalette.vue'
import ImageColourPicker from './components/ImageColourPicker.vue'

let nextColourId = 1

export default {
  name: 'app',
  components: {
    ColourPalette,
    ImageColourPicker
  },
  data () {
    return {
      palette: this.createPalette()
    }
  },
  computed: {
    currentColour: {
      get () {
        return this.palette.colours.find(x => x.isSelected)
      },
      set (colour) {
        this.palette.colours.forEach(x => (x.isSelected = x === colour))
      }
    },
    canPickColour () {
      return !!this.currentColour
    }
  },
  methods: {
    createPalette (colours) {
      colours = colours || ['#FFFFFF']
      return {
        name: '',
        type: 'regular',
        colours: colours.map((c, i) => ({
          id: nextColourId++,
          colour: c.toUpperCase(),
          isSelected: i === 0
        }))
      }
    },
    addColour () {
      const colour = {
        id: nextColourId++,
        colour: '#ffffff',
        isSelected: false
      }
      this.palette.colours.push(colour)
      this.currentColour = colour
    },
    colourPicked (colour) {
      let currentColour = this.currentColour

      if (currentColour) {
        currentColour.colour = colour
      }
    },
    importPalette (palette) {
      this.palette = this.createPalette(palette.colours)
      this.palette.name = palette.name
      this.palette.type = palette.type
    },
    discardPalette () {
      this.palette = this.createPalette()
    },
    selectColour (colour) {
      this.currentColour = colour
    },
    removeColour (colour) {
      this.palette.colours = this.palette.colours.filter(x => x !== colour)
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
  width: 20rem;
  height: 100%;
  box-sizing: border-box;
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
button.icon-button {
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

  &:active {
    color: @tool-colour-active;
  }
}
</style>
