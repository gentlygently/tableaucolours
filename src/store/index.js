import Vue from 'vue'
import Vuex from 'vuex'
import image from './modules/image'
import palette from './modules/palette'

Vue.use(Vuex)

const debug = import.meta.env.NODE_EBV !== 'production'

export default new Vuex.Store({
  modules: {
    image,
    palette
  },
  strict: debug
})
