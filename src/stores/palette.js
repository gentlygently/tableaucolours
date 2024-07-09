import { defineStore } from 'pinia'

let nextColourId = 1
const defaultType = 'regular'

function createColours(colours, selectFirstColour) {
  colours = colours || ['#FFFFFF']
  return colours.map((c, i) => createColour(c, selectFirstColour && i === 0))
}

function createColour(hex, isSelected) {
  if (!hex) {
    hex = '#FFFFFF'
  }
  return {
    id: nextColourId++,
    hex: hex.toUpperCase(),
    isSelected: isSelected === true,
  }
}

export const usePaletteStore = defineStore('palette', {
  state: () => ({
    name: '',
    type: defaultType,
    maximumColours: 20,
    colours: createColours(null, true),
  }),

  getters: {
    canAddColour: state => state.colours.length < state.maximumColours,

    selectedColour: state => state.colours.find(x => x.isSelected),
  },

  actions: {
    addColour() {
      if (this.colours.length >= this.maximumColours) {
        return
      }
      this.colours.push(createColour('#FFFFFF'))
      this.selectColour(this.colours[this.colours.length - 1])
    },

    addColours(hexes) {
      const colourCapacity = this.maximumColours - this.colours.length
      if (hexes.length > colourCapacity) {
        hexes = hexes.slice(0, colourCapacity)
      }
      hexes.forEach(x => this.colours.push(createColour(x)))
    },

    import(name, type, colours) {
      this.name = name || ''
      this.type = type || 'regular'
      this.colours = createColours(colours)
    },

    moveColour(colour, newIndex) {
      let colours = this.colours
      const oldIndex = colours.indexOf(colour)
      colours.splice(newIndex, 0, colours.splice(oldIndex, 1)[0])
      this.colours = colours
    },

    removeColour(colour) {
      this.colours = this.colours.filter(x => x !== colour)
    },

    replaceColours(hexes) {
      if (hexes.length > this.maximumColours) {
        hexes = hexes.slice(0, this.maximumColours)
      }
      this.colours = createColours(hexes, true)
    },

    reset() {
      this.$reset()
    },

    selectColour(colour) {
      this.colours.forEach(x => {
        x.isSelected = x === colour
      })
    },

    updateColour(colour, hex) {
      colour.hex = hex
    },

    updateSelectedColour(hex) {
      const selectedColour = this.colours.find(x => x.isSelected)
      if (selectedColour) {
        this.updateColour(selectedColour, hex)
      }
    },
  },
})
