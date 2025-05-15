import { create } from 'zustand'

export const useModelsStorage = create((set) => ({
  // Sahnedeki modelleri tutan dizi
  models: [],

  // Yeni bir model ekle
  addModel: (model) =>
    set((state) => ({
      models: [...state.models, model],
    })),

  // Bir modeli id’sine göre kaldır
  removeModel: (id) =>
    set((state) => ({
      models: state.models.filter((m) => m.id !== id),
    })),

  // Tüm modelleri temizle
  clearModels: () =>
    set({
      models: [],
    }),

  // Toplu set etme fonksiyonu
  setModels: (newModels) =>
    set({
      models: newModels,
    }),
}))
