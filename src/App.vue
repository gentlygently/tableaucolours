<template>
  <main id="app">
    <section id="palettesection">
      <colour-palette 
        :palette="palette" 
        @add-colour="addColour"
        @select-colour="selectColour"
        @remove-colour="removeColour" />
    </section>
    <section id="imagesection">
      <image-colour-picker 
        :can-pick-colour="canPickColour"
        @colour-picked="colourPicked" />
    </section>
  </main>
</template>

<script>
import ColourPalette from './components/ColourPalette.vue'
import ImageColourPicker from './components/ImageColourPicker.vue'

let nextColourId = 1;

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
                  id: nextColourId++,
                  colour: '#ffffff',
                  isSelected: true
              }
          ]
        }
      }
  },
  computed: {
    currentColour: {
      get () {
          return this.palette.colours.find(x => x.isSelected);
      },
      set (colour) {
        this.palette.colours.forEach(x => x.isSelected = (x === colour));
      }  
    },
    canPickColour () {
      return this.currentColour ? true : false;
    }
  },
  methods: {
    addColour () {
      const colour = {
        id: nextColourId++,
        colour: '#ffffff',
        isSelected: false
      };
      this.palette.colours.push(colour);
      this.currentColour = colour;
    },
    colourPicked (colour) {
      let currentColour = this.currentColour;
      
      if (currentColour) {
        currentColour.colour = colour;
      }
    },
    selectColour (colour) {
      this.currentColour = colour;
    },
    removeColour (colour) {
      this.palette.colours = this.palette.colours.filter(x => x !== colour);
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
  background-color: #efeceb;
  border-right: 0.1rem solid #d8d5d3;
}
#imagesection {
  height: 100%;
  padding-bottom: 3rem;
  box-sizing: border-box;
  position: relative;
  flex-grow: 1;
  overflow: hidden;
}
</style>
