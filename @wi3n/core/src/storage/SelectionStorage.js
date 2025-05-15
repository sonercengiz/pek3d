import { create } from 'zustand'

export const useSelectionStorage = create((set) => ({
  selectedId: null,
  select: (id) => set({ selectedId: id }),
  clearSelection: () => set({ selectedId: null }),
}))
