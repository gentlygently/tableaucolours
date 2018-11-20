const state = {
  image: new Image(),
  scale: 1,
  zoomRange: { min: 0.1, max: 10 }
}

const getters = {
  hasImage: state => state.image.width > 0 && state.image.height > 0
}

const mutations = {
  setImage (state, { image, scale }) {
    state.image = image
    state.scale = scale
  },

  zoom (state, { scale }) {
    if (scale < state.zoomRange.min) {
      scale = state.zoomRange.min
    } else if (scale > state.zoomRange.max) {
      scale = state.zoomRange.max
    }
    state.scale = scale
  }
}

const actions = {
  displayFirstImage (context, { files, canvas }) {
    const file = files.find(i => i.type.indexOf('image/') > -1)

    if (!file) {
      console.log('File list did not contain image')
      return
    }

    const reader = new FileReader()
    reader.onload = function () {
      const tempImage = new Image()
      tempImage.onload = function () {
        let scale = 1
        const canvasWidth = canvas.clientWidth
        const canvasHeight = canvas.clientHeight

        if (canvasWidth < this.width || canvasHeight < this.height) {
          let xRatio = canvasWidth / this.width
          let yRatio = canvasHeight / this.height

          scale = Math.floor(Math.min(xRatio, yRatio) * 100) / 100.0
        }

        context.commit('setImage', { image: this, scale })
      }
      tempImage.src = reader.result
    }
    reader.readAsDataURL(file)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
