import { create } from 'zustand'

export const useCameraStorage = create((set) => ({
  // Camera Position
  cameraPosition: [0, 10, 10],
  setCameraPosition: (newPosition) => set(() => ({ cameraPosition: newPosition })),

  // Camera Target
  cameraTarget: [0, 0, 0],
  setCameraTarget: (newTarget) => set(() => ({ cameraTarget: newTarget })),

  // Camera Zoom
  cameraZoom: 1,
  setCameraZoom: (z) => set({ cameraZoom: z })
}));