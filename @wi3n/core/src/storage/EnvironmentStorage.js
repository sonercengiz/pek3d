import { create } from 'zustand'

export const useEnvironmentStorage = create((set) => ({
  backgroundColor: '#e6e6e6',
  envMap: null,        // texture url veya THREE.Texture
  fog: { enabled: false, color: '#aaa', near: 10, far: 50 },
  setBackgroundColor: (c) => set({ backgroundColor: c }),
  setEnvMap: (map) => set({ envMap: map }),
  setFog: (fog) => set({ fog }),
}))
