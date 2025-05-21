// src/storage/SceneStorage.jsx
import { create } from 'zustand'

export const useSettingsStorage = create((set, get) => ({
  mode: 'selection',
  setMode: (mode) => set({ mode }),

  transformEditorType: 'translate',
  setTransformEditorType: (type) => set({ type }),

  floor: [],
  addFloor: (size) => set(),
  removeFloor: () => set(state => {
    if (state.floor.length > 2) state.floor.slice(-1)
  })
}))