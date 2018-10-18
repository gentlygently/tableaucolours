<template>
  <main id="app">
    <section id="palettesection">
      <colour-palette :palette="palette" />
    </section>
    <section id="imagesection">
      <image-colour-picker @colour-selected="colourSelected" />
    </section>
  </main>
</template>

<script>
import ColourPalette from './components/ColourPalette.vue'
import ImageColourPicker from './components/ImageColourPicker.vue'

export default {
  name: 'app',
  components: {
    ColourPalette,
    ImageColourPicker
  },
  data () {
      return {
        palette: {
          name: 'New colour palette',
          colours: [
              {
                  id: 1,
                  colour: '#ffffff',
                  isSelected: true
              }
          ]
        }
      }
  },
  computed: {
    currentColour () {
      return this.palette.colours.find(x => x.isSelected);
    },
    canSelectColour () {
      return this.currentColour ? true : false;
    }
  },
  methods: {
    colourSelected (colour) {
      let currentColour = this.currentColour;
      
      if (currentColour) {
        currentColour.colour = colour;
      }
    }
  }
}
</script>

<style lang="less">
html, body { 
    height: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
    font-size: 10px;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
}
#app {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    align-content: stretch;
    height: 100%;
    padding: 1rem;
    box-sizing: border-box;
    position: relative;
}
#palettesection {
  width: 15rem;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
  flex-grow: 0;
}
#imagesection {
  height: 100%;
  padding-bottom: 3rem;
  margin-left: 1rem;
  box-sizing: border-box;
  position: relative;
  flex-grow: 1;
  overflow: hidden;
}
</style>
