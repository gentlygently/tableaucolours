import { describe, expect, it, beforeEach } from 'vitest'
import { usePaletteStore } from './palette'
import { createTestPinia } from '@/testing/test-utils'

describe('Palette store', () => {
  let store

  beforeEach(() => {
    createTestPinia()
    store = usePaletteStore()
  })

  describe('initial state', () => {
    it('is not open', () => {
      expect(store.isOpen).toBe(false)
    })

    it('has default name', () => {
      expect(store.name).toBe('')
    })

    it('has default type', () => {
      expect(store.type).toBe('regular')
    })

    it('has one default white colour', () => {
      expect(store.colours).toHaveLength(1)
      expect(store.colours[0].hex).toBe('#FFFFFF')
    })

    it('has the first colour selected', () => {
      expect(store.selectedColour).toBe(store.colours[0])
    })

    it('can add colours', () => {
      expect(store.canAddColour).toBe(true)
    })

    it('cannot pick colour when not open', () => {
      expect(store.canPickColour).toBe(false)
    })
  })

  describe('open', () => {
    it('opens with default palette when no argument given', () => {
      store.open()

      expect(store.isOpen).toBe(true)
      expect(store.name).toBe('')
      expect(store.type).toBe('regular')
      expect(store.colours).toHaveLength(1)
    })

    it('opens with provided palette', () => {
      store.open({ name: 'Test', type: 'ordered-sequential', colours: ['#ff0000', '#00ff00'] })

      expect(store.isOpen).toBe(true)
      expect(store.name).toBe('Test')
      expect(store.type).toBe('ordered-sequential')
      expect(store.colours).toHaveLength(2)
      expect(store.colours[0].hex).toBe('#FF0000')
      expect(store.colours[1].hex).toBe('#00FF00')
    })

    it('resets hasChanges to false after opening', () => {
      store.open()

      expect(store.hasChanges).toBe(false)
    })

    it('resets hasChanges to false after opening with palette', () => {
      store.open({ name: 'X', type: 'regular', colours: ['#000'] })

      expect(store.hasChanges).toBe(false)
    })

    it('can pick colour when open', () => {
      store.open()

      expect(store.canPickColour).toBe(true)
    })
  })

  describe('close', () => {
    it('closes the store', () => {
      store.open()
      store.close()

      expect(store.isOpen).toBe(false)
    })
  })

  describe('selectColour', () => {
    it('selects the given colour', () => {
      store.open({ name: '', type: 'regular', colours: ['#111', '#222', '#333'] })

      store.selectColour(store.colours[2])

      expect(store.selectedColour).toBe(store.colours[2])
      expect(store.colours[0].isSelected).toBe(false)
      expect(store.colours[1].isSelected).toBe(false)
      expect(store.colours[2].isSelected).toBe(true)
    })
  })

  describe('addColour', () => {
    it('adds a white colour', () => {
      store.open()
      const initialLength = store.colours.length

      store.addColour()

      expect(store.colours).toHaveLength(initialLength + 1)
      expect(store.colours[store.colours.length - 1].hex).toBe('#FFFFFF')
    })

    it('selects the newly added colour', () => {
      store.open()

      store.addColour()

      expect(store.selectedColour).toBe(store.colours[store.colours.length - 1])
    })

    it('sets hasChanges', () => {
      store.open()

      store.addColour()

      expect(store.hasChanges).toBe(true)
    })

    it('does not add when at maximum capacity', () => {
      store.open()
      for (let i = store.colours.length; i < store.maximumColours; i++) {
        store.addColour()
      }
      const maxLength = store.colours.length

      store.addColour()

      expect(store.colours).toHaveLength(maxLength)
    })
  })

  describe('addColours', () => {
    it('adds multiple colours', () => {
      store.open()
      const initialLength = store.colours.length

      store.addColours(['#ff0000', '#00ff00'])

      expect(store.colours).toHaveLength(initialLength + 2)
    })

    it('truncates to maximum capacity', () => {
      store.open({ name: '', type: 'regular', colours: ['#000'] })
      const capacity = store.maximumColours - store.colours.length

      store.addColours(Array(capacity + 5).fill('#fff'))

      expect(store.colours).toHaveLength(store.maximumColours)
    })

    it('does nothing when adding empty array', () => {
      store.open()
      store.hasChanges = false

      store.addColours([])

      expect(store.hasChanges).toBe(false)
    })
  })

  describe('updateColour', () => {
    it('updates a colour hex value', () => {
      store.open()

      store.updateColour(store.colours[0], '#ff0000')

      expect(store.colours[0].hex).toBe('#ff0000')
      expect(store.hasChanges).toBe(true)
    })
  })

  describe('updateSelectedColour', () => {
    it('updates the selected colour', () => {
      store.open()

      store.updateSelectedColour('#00ff00')

      expect(store.selectedColour.hex).toBe('#00ff00')
    })

    it('does nothing when no colour is selected', () => {
      store.open()
      store.colours.forEach(c => (c.isSelected = false))

      store.updateSelectedColour('#00ff00')

      expect(store.colours[0].hex).not.toBe('#00ff00')
    })
  })

  describe('moveColour', () => {
    it('moves a colour to a new position', () => {
      store.open({ name: '', type: 'regular', colours: ['#111', '#222', '#333'] })
      const colour = store.colours[0]

      store.moveColour(colour, 2)

      expect(store.colours[2]).toBe(colour)
      expect(store.hasChanges).toBe(true)
    })
  })

  describe('reverseColours', () => {
    it('reverses the colour order', () => {
      store.open({ name: '', type: 'regular', colours: ['#111', '#222', '#333'] })

      store.reverseColours()

      expect(store.colours[0].hex).toBe('#333')
      expect(store.colours[2].hex).toBe('#111')
      expect(store.hasChanges).toBe(true)
    })

    it('does not reverse a single colour', () => {
      store.open()
      store.hasChanges = false

      store.reverseColours()

      expect(store.hasChanges).toBe(false)
    })
  })

  describe('removeColour', () => {
    it('removes the colour', () => {
      store.open({ name: '', type: 'regular', colours: ['#111', '#222', '#333'] })
      const colourToRemove = store.colours[1]

      store.removeColour(colourToRemove)

      expect(store.colours).toHaveLength(2)
      expect(store.colours.find(c => c === colourToRemove)).toBeUndefined()
      expect(store.hasChanges).toBe(true)
    })

    it('selects the next colour when removing the selected one', () => {
      store.open({ name: '', type: 'regular', colours: ['#111', '#222', '#333'] })
      store.selectColour(store.colours[1])

      store.removeColour(store.colours[1])

      expect(store.selectedColour).toBe(store.colours[1])
    })

    it('selects the last colour when removing the last selected one', () => {
      store.open({ name: '', type: 'regular', colours: ['#111', '#222', '#333'] })
      store.selectColour(store.colours[2])

      store.removeColour(store.colours[2])

      expect(store.selectedColour).toBe(store.colours[store.colours.length - 1])
    })

    it('does nothing when colour is not found', () => {
      store.open()
      const fake = { id: 999, hex: '#000', isSelected: false }

      store.removeColour(fake)

      expect(store.colours).toHaveLength(1)
    })
  })

  describe('replacePalette', () => {
    it('replaces the entire palette', () => {
      store.open()

      store.replacePalette('New', 'ordered-diverging', ['#aaa', '#bbb'])

      expect(store.name).toBe('New')
      expect(store.type).toBe('ordered-diverging')
      expect(store.colours).toHaveLength(2)
      expect(store.hasChanges).toBe(true)
    })
  })

  describe('replaceColours', () => {
    it('replaces all colours', () => {
      store.open()

      store.replaceColours(['#ff0000', '#00ff00', '#0000ff'])

      expect(store.colours).toHaveLength(3)
      expect(store.colours[0].hex).toBe('#FF0000')
      expect(store.selectedColour).toBe(store.colours[0])
    })

    it('truncates to maximum when given too many', () => {
      store.open()

      store.replaceColours(Array(25).fill('#fff'))

      expect(store.colours).toHaveLength(store.maximumColours)
    })
  })

  describe('hasChanges tracking', () => {
    it('setting name marks hasChanges', () => {
      store.open()

      store.name = 'Changed'

      expect(store.hasChanges).toBe(true)
    })

    it('setting type marks hasChanges', () => {
      store.open()

      store.type = 'ordered-diverging'

      expect(store.hasChanges).toBe(true)
    })
  })
})
