import { describe, expect, it, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useTpsFileStore } from './tpsfile'
import { createTestPinia } from '@/testing/test-utils'

describe('TPS file store', () => {
  let store

  beforeEach(() => {
    createTestPinia()
    store = useTpsFileStore()
  })

  const samplePalettes = [
    { name: 'Red', type: 'regular', colours: ['#FF0000', '#CC0000'] },
    { name: 'Blue', type: 'ordered-sequential', colours: ['#0000FF'] },
    { name: 'Green', type: 'ordered-diverging', colours: ['#00FF00'] },
  ]

  describe('initial state', () => {
    it('is not open', () => {
      expect(store.isOpen).toBe(false)
    })

    it('has no palettes', () => {
      expect(store.palettes).toHaveLength(0)
    })

    it('has no changes', () => {
      expect(store.hasChanges).toBe(false)
    })

    it('has empty file name', () => {
      expect(store.fileName).toBe('')
    })

    it('has empty file contents', () => {
      expect(store.fileContents).toBe('')
    })

    it('has no current palette', () => {
      expect(store.hasCurrentPalette).toBe(false)
    })
  })

  describe('open', () => {
    it('sets file name', () => {
      store.open('test.tps', '<xml/>', samplePalettes)

      expect(store.fileName).toBe('test.tps')
    })

    it('sets file contents', () => {
      store.open('test.tps', '<xml/>', samplePalettes)

      expect(store.fileContents).toBe('<xml/>')
    })

    it('marks store as open', () => {
      store.open('test.tps', '<xml/>', samplePalettes)

      expect(store.isOpen).toBe(true)
    })

    it('loads palettes', () => {
      store.open('test.tps', '<xml/>', samplePalettes)

      expect(store.palettes).toHaveLength(3)
      expect(store.palettes[0].name).toBe('Red')
      expect(store.palettes[1].name).toBe('Blue')
      expect(store.palettes[2].name).toBe('Green')
    })

    it('makes first palette current', () => {
      store.open('test.tps', '<xml/>', samplePalettes)

      expect(store.palettes[0].isCurrent).toBe(true)
      expect(store.palettes[1].isCurrent).toBe(false)
    })

    it('maps palette colours', () => {
      store.open('test.tps', '<xml/>', samplePalettes)

      expect(store.palettes[0].colours).toEqual(['#FF0000', '#CC0000'])
    })

    it('resets hasChanges', () => {
      store.open('test.tps', '<xml/>', samplePalettes)
      store.hasChanges = true
      store.open('x.tps', '', [{ name: 'A', type: 'regular', colours: ['#000'] }])

      expect(store.hasChanges).toBe(false)
    })

    it('resets filter values', () => {
      store.open('test.tps', '<xml/>', samplePalettes)
      store.paletteFilterValues.name = 'test'
      store.open('x.tps', '', [{ name: 'A', type: 'regular', colours: ['#000'] }])

      expect(store.paletteFilterValues.name).toBe('')
    })
  })

  describe('close', () => {
    it('clears file data', () => {
      store.open('test.tps', '<xml/>', samplePalettes)
      store.close()

      expect(store.isOpen).toBe(false)
      expect(store.fileName).toBe('')
    })

    it('clears palettes', () => {
      store.open('test.tps', '<xml/>', samplePalettes)
      store.close()

      expect(store.palettes).toHaveLength(0)
    })
  })

  describe('addPalette', () => {
    beforeEach(() => store.open('test.tps', '<xml/>', samplePalettes))

    it('adds a palette', () => {
      store.addPalette('New', 'regular', ['#AABBCC'])

      expect(store.palettes).toHaveLength(4)
      expect(store.palettes[3].name).toBe('New')
    })

    it('makes added palette current', () => {
      store.addPalette('New', 'regular', ['#AABBCC'])

      expect(store.palettes[3].isCurrent).toBe(true)
      expect(store.palettes[0].isCurrent).toBe(false)
    })

    it('marks added palette as changed', () => {
      store.addPalette('New', 'regular', ['#AABBCC'])

      expect(store.palettes[3].hasChanges).toBe(true)
    })

    it('marks store as changed', () => {
      store.hasChanges = false
      store.addPalette('New', 'regular', ['#AABBCC'])

      expect(store.hasChanges).toBe(true)
    })
  })

  describe('updateCurrentPalette', () => {
    beforeEach(() => store.open('test.tps', '<xml/>', samplePalettes))

    it('updates name', () => {
      store.updateCurrentPalette('Updated', 'regular', ['#000'])

      expect(store.palettes[0].name).toBe('Updated')
    })

    it('updates type', () => {
      store.updateCurrentPalette('Red', 'ordered-sequential', ['#000'])

      expect(store.palettes[0].type).toBe('ordered-sequential')
    })

    it('updates colours', () => {
      store.updateCurrentPalette('Red', 'regular', ['#111', '#222'])

      expect(store.palettes[0].colours).toEqual(['#111', '#222'])
    })

    it('marks palette as changed', () => {
      store.updateCurrentPalette('Red', 'regular', ['#000'])

      expect(store.palettes[0].hasChanges).toBe(true)
    })

    it('marks store as changed', () => {
      store.hasChanges = false
      store.updateCurrentPalette('Red', 'regular', ['#000'])

      expect(store.hasChanges).toBe(true)
    })

    it('maps colour objects to hex strings', () => {
      store.updateCurrentPalette('Red', 'regular', [
        { hex: '#AABB00', id: 1, isSelected: false },
      ])

      expect(store.palettes[0].colours).toEqual(['#AABB00'])
    })
  })

  describe('deletePalette', () => {
    beforeEach(() => store.open('test.tps', '<xml/>', samplePalettes))

    it('removes the palette', () => {
      store.deletePalette(store.palettes[1])

      expect(store.palettes).toHaveLength(2)
      expect(store.palettes.find(p => p.name === 'Blue')).toBeUndefined()
    })

    it('selects next palette when current is deleted', () => {
      store.deletePalette(store.palettes[0])

      expect(store.palettes[0].isCurrent).toBe(true)
      expect(store.palettes[0].name).toBe('Blue')
    })

    it('selects last palette when last is deleted', () => {
      store.setCurrentPalette(store.palettes[2])
      store.deletePalette(store.palettes[2])

      expect(store.palettes[1].isCurrent).toBe(true)
    })

    it('marks store as changed', () => {
      store.hasChanges = false
      store.deletePalette(store.palettes[0])

      expect(store.hasChanges).toBe(true)
    })

    it('does nothing for unknown palette', () => {
      store.deletePalette({ id: 999 })

      expect(store.palettes).toHaveLength(3)
    })
  })

  describe('movePalette', () => {
    beforeEach(() => store.open('test.tps', '<xml/>', samplePalettes))

    it('moves palette to new position', () => {
      const palette = store.palettes[0]
      store.movePalette(palette, 2)

      expect(store.palettes[2].name).toBe('Red')
    })

    it('marks store as changed', () => {
      store.hasChanges = false
      store.movePalette(store.palettes[0], 1)

      expect(store.hasChanges).toBe(true)
    })

    it('does not move when filters are active', async () => {
      store.isFilterActive = true
      store.paletteFilterValues.selected = true
      await nextTick()

      store.movePalette(store.palettes[0], 2)

      expect(store.palettes[0].name).toBe('Red')
    })
  })

  describe('selection', () => {
    beforeEach(() => store.open('test.tps', '<xml/>', samplePalettes))

    it('selects all palettes', () => {
      store.selectAllPalettes()

      expect(store.palettes.every(p => p.isSelected)).toBe(true)
    })

    it('clears selection', () => {
      store.selectAllPalettes()
      store.clearPaletteSelection()

      expect(store.palettes.every(p => !p.isSelected)).toBe(true)
    })

    it('reports selected palettes', () => {
      store.palettes[0].isSelected = true
      store.palettes[2].isSelected = true

      expect(store.selectedPalettes).toHaveLength(2)
      expect(store.hasSelectedPalettes).toBeTruthy()
    })
  })

  describe('saved', () => {
    beforeEach(() => store.open('test.tps', '<xml/>', samplePalettes))

    it('clears hasChanges on all palettes', () => {
      store.palettes.forEach(p => (p.hasChanges = true))
      store.saved()

      expect(store.palettes.every(p => !p.hasChanges)).toBe(true)
    })

    it('clears store hasChanges', () => {
      store.hasChanges = true
      store.saved()

      expect(store.hasChanges).toBe(false)
    })

    it('updates file name when provided', () => {
      store.saved('new.tps')

      expect(store.fileName).toBe('new.tps')
    })

    it('keeps file name when not provided', () => {
      store.saved()

      expect(store.fileName).toBe('test.tps')
    })
  })

  describe('filtering', () => {
    beforeEach(() => {
      store.open('test.tps', '<xml/>', [
        ...samplePalettes,
        { name: '', type: 'regular', colours: ['#000'] },
      ])
      store.isFilterActive = true
    })

    it('returns all palettes when filtering is inactive', () => {
      store.isFilterActive = false

      expect(store.filteredPalettes).toHaveLength(4)
    })

    it('filters by name', async () => {
      store.paletteFilterValues.name = 'red'
      await nextTick()

      // NameFilter also includes palettes with no name when a name filter is set
      expect(store.filteredPalettes).toHaveLength(2)
      expect(store.filteredPalettes[0].name).toBe('Red')
      expect(store.filteredPalettes[1].name).toBe('')
    })

    it('filters by name case-insensitively', async () => {
      store.paletteFilterValues.name = 'RED'
      await nextTick()

      expect(store.filteredPalettes).toHaveLength(2)
    })

    it('filters by type', async () => {
      store.paletteFilterValues.types = ['ordered-sequential']
      await nextTick()

      expect(store.filteredPalettes).toHaveLength(1)
      expect(store.filteredPalettes[0].name).toBe('Blue')
    })

    it('filters by multiple types', async () => {
      store.paletteFilterValues.types = ['regular', 'ordered-diverging']
      await nextTick()

      expect(store.filteredPalettes).toHaveLength(3)
    })

    it('filters by selected', async () => {
      store.palettes[1].isSelected = true
      store.paletteFilterValues.selected = true
      await nextTick()

      expect(store.filteredPalettes).toHaveLength(1)
      expect(store.filteredPalettes[0].name).toBe('Blue')
    })

    it('filters by hasChanges', async () => {
      store.palettes[2].hasChanges = true
      store.paletteFilterValues.hasChanges = true
      await nextTick()

      expect(store.filteredPalettes).toHaveLength(1)
      expect(store.filteredPalettes[0].name).toBe('Green')
    })

    it('combines multiple filters', async () => {
      store.palettes[0].isSelected = true
      store.palettes[1].isSelected = true
      store.paletteFilterValues.selected = true
      store.paletteFilterValues.types = ['regular']
      await nextTick()

      expect(store.filteredPalettes).toHaveLength(1)
      expect(store.filteredPalettes[0].name).toBe('Red')
    })

    it('reports active filters', async () => {
      store.paletteFilterValues.name = 'test'
      await nextTick()

      expect(store.hasActiveFilters).toBeTruthy()
    })

    it('reports no active filters when filter panel closed', () => {
      store.paletteFilterValues.name = 'test'
      store.isFilterActive = false

      expect(store.hasActiveFilters).toBeFalsy()
    })

    it('reports palettes are filtered', async () => {
      store.paletteFilterValues.name = 'red'
      await nextTick()

      expect(store.arePalettesFiltered).toBe(true)
    })

    it('reports palettes are not filtered when all match', () => {
      expect(store.arePalettesFiltered).toBe(false)
    })
  })

  describe('setCurrentPalette', () => {
    beforeEach(() => store.open('test.tps', '<xml/>', samplePalettes))

    it('sets the given palette as current', () => {
      store.setCurrentPalette(store.palettes[2])

      expect(store.palettes[2].isCurrent).toBe(true)
      expect(store.palettes[0].isCurrent).toBe(false)
    })

    it('exposes currentPalette computed', () => {
      store.setCurrentPalette(store.palettes[1])

      expect(store.currentPalette.name).toBe('Blue')
    })
  })

  describe('deleteSelectedPalettes', () => {
    beforeEach(() => store.open('test.tps', '<xml/>', samplePalettes))

    it('deletes all selected palettes', () => {
      store.palettes[0].isSelected = true
      store.palettes[2].isSelected = true

      store.deleteSelectedPalettes()

      expect(store.palettes).toHaveLength(1)
      expect(store.palettes[0].name).toBe('Blue')
    })
  })
})
