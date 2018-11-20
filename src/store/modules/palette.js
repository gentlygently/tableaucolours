let nextColourId = 1
const defaultType = 'regular'

function createColours (colours) {
  colours = colours || ['#FFFFFF']
  return colours.map((c, i) => ({
    id: nextColourId++,
    hex: c.toUpperCase(),
    isSelected: i === 0
  }))
}

const state = {
  name: '',
  type: defaultType,
  maximumColours: 20,
  colours: createColours()
}

const getters = {
  canAddColour: (state) => state.colours.length < state.maximumColours,

  selectedColour: (state) => state.colours.find(x => x.isSelected)
}

const mutations = {
  addColour (state) {
    if (state.colours.length >= state.maximumColours) {
      return
    }
    const colour = {
      id: nextColourId++,
      hex: '#FFFFFF',
      isSelected: false
    }
    state.colours.push(colour)
  },

  import (state, { name, type, colours }) {
    state.name = name
    state.type = type
    state.colours = createColours(colours)
  },

  moveColour (state, { colour, newIndex }) {
    let colours = state.colours
    const oldIndex = colours.indexOf(colour)
    colours.splice(newIndex, 0, colours.splice(oldIndex, 1)[0])
    state.colours = colours
  },

  removeColour (state, { colour }) {
    state.colours = state.colours.filter(x => x !== colour)
  },

  reset (state) {
    state.name = ''
    state.type = defaultType
    state.colours = createColours()
  },

  selectColour (state, { colour }) {
    state.colours.forEach(x => {
      x.isSelected = x === colour
    })
  },

  setName (state, { name }) {
    state.name = name
  },

  setType (state, { type }) {
    state.type = type
  },

  updateColour (state, { colour, hex }) {
    colour.hex = hex
  }
}

const actions = {
  addColour (context) {
    context.commit('addColour')
    const colours = context.state.colours
    context.commit('selectColour', { colour: colours[colours.length - 1] })
  },

  updateSelectedColour (context, { hex }) {
    const selectedColour = state.colours.find(x => x.isSelected)
    if (selectedColour) {
      context.commit('updateColour', { colour: selectedColour, hex })
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
