import { create } from 'zustand'

export const useHistoryStorage = create((set) => ({
  past: [],
  future: [],
  addState: (snapshot) =>
    set(s => ({ past: [...s.past, snapshot], future: [] })),
  undo: () =>
    set(s => {
      if (s.past.length === 0) return {}
      const previous = s.past[s.past.length - 1]
      return { past: s.past.slice(0, -1), future: [previous, ...s.future] }
    }),
  redo: () =>
    set(s => {
      if (s.future.length === 0) return {}
      const next = s.future[0]
      return { past: [...s.past, next], future: s.future.slice(1) }
    }),
}))
