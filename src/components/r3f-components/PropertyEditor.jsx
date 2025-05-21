// src/components/r3f-components/PropertyEditor.jsx
import React from 'react'
import { useModelsStorage } from 'wi3n-core'

export default function PropertyEditor() {
  const selectedId = useModelsStorage(s => s.selectedId)
  const selected = useModelsStorage(s => s.getSelectedModel())
  const { updateModelTransform } = useModelsStorage()

  if (!selected) return null

  const handleArrayChange = (key, idx) => e => {
    const val = parseFloat(e.target.value)
    if (Number.isNaN(val)) return
    const arr = [...selected[key]]
    arr[idx] = val
    updateModelTransform(selectedId, { [key]: arr })
  }

  return (
    <div style={{ position: 'absolute', right: 10, top: 10, color: '#fff', background: '#0008', padding: 12 }}>
      <h4>{selected.modelName}</h4>

      <div>
        <strong>Position</strong><br />
        {['X', 'Y', 'Z'].map((ax, i) => (
          <label key={ax} style={{ marginRight: 8 }}>
            {ax}:
            <input
              type="number" step="0.1"
              value={selected.position[i]}
              onChange={handleArrayChange('position', i)}
              style={{ width: 50, marginLeft: 4 }}
            />
          </label>
        ))}
      </div>

      <div>
        <strong>Rotation</strong><br />
        {['X', 'Y', 'Z'].map((ax, i) => (
          <label key={ax} style={{ marginRight: 8 }}>
            {ax}:
            <input
              type="number" step="0.1"
              value={selected.rotation[i]}
              onChange={handleArrayChange('rotation', i)}
              style={{ width: 50, marginLeft: 4 }}
            />
          </label>
        ))}
      </div>

      <div>
        <strong>Scale</strong><br />
        {['X', 'Y', 'Z'].map((ax, i) => (
          <label key={ax} style={{ marginRight: 8 }}>
            {ax}:
            <input
              type="number" step="0.1"
              value={selected.scale[i]}
              onChange={handleArrayChange('scale', i)}
              style={{ width: 50, marginLeft: 4 }}
            />
          </label>
        ))}
      </div>
    </div>
  )
}
