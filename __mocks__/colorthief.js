import { vi } from 'vitest'

const mockGetPalette = vi.fn()

function MockColorThief() {
  return {
    getPalette: mockGetPalette,
  }
}

export default MockColorThief
export { mockGetPalette }
