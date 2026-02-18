import { afterEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import 'vitest-canvas-mock'

afterEach(() => {
  vi.resetAllMocks()
})
