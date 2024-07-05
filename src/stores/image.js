import { defineStore } from 'pinia'

export const useImageStore = defineStore('image', {

    state: () => ({
        image: new Image(),
        scale: 1,
        zoomRange: { min: 0.1, max: 10 }
    }),

    getters: {
        hasImage: (state) => state.image.width > 0 && state.image.height > 0
    },

    actions: {
        setImage (image, scale) {
            this.image = image
            this.scale = scale
        },
        
        zoom (scale) {
            if (scale < this.zoomRange.min) {
                scale = this.zoomRange.min
            } else if (scale > this.zoomRange.max) {
                scale = this.zoomRange.max
            }
            this.scale = scale
        },

        displayFirstImage (files, canvas) {
            const file = files.find(i => i.type.indexOf('image/') > -1)
        
            if (!file) {
                console.log('File list did not contain image')
                return
            }
        
            const reader = new FileReader()
            const state = this;

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
            
                    state.setImage(this, scale)
                }
                tempImage.src = reader.result
            }
            reader.readAsDataURL(file)
        }
    }
})
  