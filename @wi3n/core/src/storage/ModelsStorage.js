// src/store/ModelsStorage.js
import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

export const useModelsStorage = create((set, get) => ({
  // --- State ---
  models: [],               // { id, name, path, instanceId, children: [], selected: bool }
  selectedId: null,         // seçili modelin instanceId’si

  // --- Selector ---
  getSelectedModel: () => {
    const { models, selectedId } = get()
    return models.find(m => m.instanceId === selectedId) || null
  },

  // --- Actions ---
  addModel: (model, selectNew = false) => {
    const instanceId = uuidv4()
    set(state => {
      // tüm eski seçimleri kaldır
      const cleared = state.models.map(m => ({ ...m, selected: false }))
      const newEntry = {
        ...model,
        instanceId,
        children: [],       // başlangıçta alt öğe yok
        selected: selectNew
      }
      return {
        models: [...cleared, newEntry],
        selectedId: selectNew ? instanceId : state.selectedId
      }
    })
    return instanceId
  },

  updateModelChildren: (instanceId, children) => {
    set(state => ({
      models: state.models.map(m =>
        m.instanceId === instanceId
          ? { ...m, children }
          : m
      )
    }))
  },

  removeModel: (instanceId) => {
    set(state => ({
      models: state.models.filter(m => m.instanceId !== instanceId),
      selectedId: state.selectedId === instanceId ? null : state.selectedId
    }))
  },

  clearModels: () => {
    set({ models: [], selectedId: null })
  },

  setModels: (newModels) => {
    set({ models: newModels.map(m => ({ ...m, selected: false })), selectedId: null })
  },

  // --- Selection ---
  select: (instanceId) => {
    set(state => ({
      selectedId: instanceId,
      models: state.models.map(m => ({
        ...m,
        selected: m.instanceId === instanceId
      }))
    }))
  },

  clearSelection: () => {
    set(state => ({
      selectedId: null,
      models: state.models.map(m => ({ ...m, selected: false }))
    }))
  }
}))
