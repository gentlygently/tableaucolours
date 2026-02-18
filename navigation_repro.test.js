
import { describe, expect, it } from 'vitest'

function getValidColumnIndex(currentIndex, increment) {
  const store = { colours: { length: 20 } }
  const newIndex = currentIndex + increment
  if (newIndex < 0 || newIndex >= store.colours.length) {
    return -1
  }
  const currentColumn = Math.floor(currentIndex / 5)
  const newColumn = Math.floor(newIndex / 5)

  return newColumn === currentColumn ? newIndex : -1
}

describe('Navigation Logic', () => {
  it('ArrowDown (increment 1) moves from 0 to 1', () => {
    // Visual: 0 is (0,0). 1 is (0,1). Down moves to 4 (1,0)?
    // Wait, ArrowDown usually moves vertically.
    // If layout is row-major: 0 -> 4.
    // Logic: index + 1. 0 -> 1.
    // 0 -> 1 is horizontal move (Right).
    // Why is ArrowDown mapped to increment 1?
    expect(getValidColumnIndex(0, 1)).toBe(1)
  })
})
