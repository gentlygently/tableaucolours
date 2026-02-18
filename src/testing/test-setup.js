import { afterEach, vi } from 'vitest'
import { enableAutoUnmount } from '@vue/test-utils'
import '@testing-library/jest-dom/vitest'
import 'vitest-canvas-mock'

enableAutoUnmount(afterEach)

afterEach(() => {
  vi.resetAllMocks()
})
