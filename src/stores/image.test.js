import { describe, expect, it, beforeEach } from 'vitest'
import { useImageStore } from './image'
import { createTestPinia } from '@/testing/test-utils'

describe('Image store', () => {
  let store

  beforeEach(() => {
    createTestPinia()
    store = useImageStore()
  })

  describe('initial state', () => {
    it('has no image', () => {
      expect(store.hasImage).toBe(false)
    })

    it('has default scale of 1', () => {
      expect(store.scale).toBe(1)
    })

    it('has zoom range', () => {
      expect(store.zoomRange.min).toBe(0.1)
      expect(store.zoomRange.max).toBe(10)
    })
  })

  describe('setImage', () => {
    it('sets the image and scale', () => {
      const img = new Image()
      Object.defineProperty(img, 'width', { value: 100 })
      Object.defineProperty(img, 'height', { value: 200 })

      store.setImage(img, 0.5)

      expect(store.image).toBe(img)
      expect(store.scale).toBe(0.5)
      expect(store.hasImage).toBe(true)
    })
  })

  describe('zoom', () => {
    it('sets the scale', () => {
      store.zoom(2)

      expect(store.scale).toBe(2)
    })

    it('clamps to minimum', () => {
      store.zoom(0.01)

      expect(store.scale).toBe(store.zoomRange.min)
    })

    it('clamps to maximum', () => {
      store.zoom(100)

      expect(store.scale).toBe(store.zoomRange.max)
    })
  })
})
