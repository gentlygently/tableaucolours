import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useImageStore = defineStore('image', () => {
  const image = ref(new Image())
  const scale = ref(1)
  const zoomRange = ref({ min: 0.1, max: 10 })
  const hasImage = computed(() => image.value.width > 0 && image.value.height > 0)

  function setImage(newImage, newScale) {
    image.value = newImage
    scale.value = newScale
  }

  function zoom(newScale) {
    if (newScale < zoomRange.value.min) {
      newScale = zoomRange.value.min
    } else if (newScale > zoomRange.value.max) {
      newScale = zoomRange.value.max
    }
    scale.value = newScale
  }

  return { image, scale, zoomRange, hasImage, setImage, zoom }
})
