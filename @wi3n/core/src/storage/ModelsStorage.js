// src/store/ModelsStorage.js
import { create } from 'zustand'

export const useModelsStorage = create((set) => ({
  // Sahnedeki modelleri tutan dizi
  // her bir model: { id, name, path, children: Array<{id, name}> }
  models: [],

  // Yeni bir model ekle
  addModel: (model) =>
    set((state) => ({
      models: [
        ...state.models,
        {
          ...model,
          children: []    // ilk başta alt öğe yok
        }
      ]
    })),

  // Bir modelin alt öğe listesini güncelle
  updateModelChildren: (id, children) =>
    set((state) => ({
      models: state.models.map((m) =>
        m.id === id
          ? { ...m, children }
          : m
      )
    })),

  // Bir modeli id’sine göre kaldır
  removeModel: (id) =>
    set((state) => ({
      models: state.models.filter((m) => m.id !== id),
      // eğer silinen seçili modelse, seçimi temizle
      selectedId: state.selectedId === id ? null : state.selectedId
    })),

  // Tüm modelleri temizle
  clearModels: () =>
    set({
      models: []
    }),

  // Toplu set etme fonksiyonu
  setModels: (newModels) =>
    set({
      models: newModels
    }),
}))
