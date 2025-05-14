import { create } from 'zustand'

export const useControlsStorage = create((set) => ({
  enablePan: true,
  enableRotate: true,
  enableZoom: true,
  rotateSpeed: 0.5,
  zoomSpeed: 1,
  setControl: (key, value) => set({ [key]: value }),
}))
