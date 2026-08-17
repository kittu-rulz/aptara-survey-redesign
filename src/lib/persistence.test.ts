import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  clearPersistedState,
  loadPersistedState,
  savePersistedState,
  PERSISTENCE_SCHEMA_VERSION,
} from './persistence'

const STORAGE_KEY = 'aptara-assessment-state'

describe('persistence', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })
  afterEach(() => {
    sessionStorage.clear()
  })

  it('returns null when nothing has been saved', () => {
    expect(loadPersistedState()).toBeNull()
  })

  it('restores a previously saved valid state', () => {
    const state = {
      version: PERSISTENCE_SCHEMA_VERSION,
      currentIndex: 2,
      answers: { Q1: 'A', Q2: 'C' } as const,
    }
    savePersistedState(state)
    expect(loadPersistedState()).toEqual(state)
  })

  it('discards state from an unrecognized schema version instead of guessing', () => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 999, currentIndex: 1, answers: { Q1: 'A' } }),
    )
    expect(loadPersistedState()).toBeNull()
  })

  it('discards corrupt JSON safely instead of throwing', () => {
    sessionStorage.setItem(STORAGE_KEY, '{not valid json::')
    expect(() => loadPersistedState()).not.toThrow()
    expect(loadPersistedState()).toBeNull()
  })

  it('discards a structurally invalid payload (out-of-range index)', () => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: PERSISTENCE_SCHEMA_VERSION, currentIndex: 99, answers: {} }),
    )
    expect(loadPersistedState()).toBeNull()
  })

  it('discards a payload with an invalid answer code (tampered data)', () => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: PERSISTENCE_SCHEMA_VERSION,
        currentIndex: 0,
        answers: { Q1: 'Z' },
      }),
    )
    expect(loadPersistedState()).toBeNull()
  })

  it('clears state (simulating completion or restart)', () => {
    savePersistedState({ version: PERSISTENCE_SCHEMA_VERSION, currentIndex: 1, answers: {} })
    expect(loadPersistedState()).not.toBeNull()
    clearPersistedState()
    expect(loadPersistedState()).toBeNull()
  })
})
