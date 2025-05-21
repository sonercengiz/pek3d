// src/store/ModelsStorage.js
import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

export const useModelsStorage = create((set, get) => ({
  // --- State ---
  models: [],               // her model: { id, name, path, instanceId, children, selected, position, rotation, scale }
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
      // eskileri seçimsizleştir
      const cleared = state.models.map(m => ({ ...m, selected: false }))
      const newEntry = {
        ...model,
        instanceId,
        children: [],
        selected: selectNew,
        showWireframe: false,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      }
      return {
        models: [...cleared, newEntry],
        selectedId: selectNew ? instanceId : state.selectedId
      }
    })
    return instanceId
  },

  updateModelProp: (instanceId, props) => {
    set(state => ({
      models: state.models.map(m =>
        m.instanceId === instanceId
          ? { ...m, ...props }
          : m
      )
    }))
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
    set({
      models: newModels.map(m => ({
        ...m,
        children: m.children || [],
        selected: false,
        showWireframe: false,
        position: m.position || [0, 0, 0],
        rotation: m.rotation || [0, 0, 0],
        scale: m.scale || [1, 1, 1],
      })),
      selectedId: null
    })
  },

  // --- transform güncelleme ---
  updateModelTransform: (instanceId, { position, rotation, scale }) => {
    set(state => ({
      models: state.models.map(m =>
        m.instanceId === instanceId
          ? {
            ...m,
            position: position ?? m.position,
            rotation: rotation ?? m.rotation,
            scale: scale ?? m.scale,
          }
          : m
      )
    }))
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
