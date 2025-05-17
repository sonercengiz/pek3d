// src/components/SideMenu/SceneTree.jsx
import React, { useMemo } from 'react'
import { RichTreeView } from '@mui/x-tree-view'
import WidgetsIcon from '@mui/icons-material/Widgets'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useModelsStorage } from '@wi3n/core'

export default function SceneTree() {
  const models = useModelsStorage(s => s.models)
  const select = useModelsStorage(s => s.select)
  const selectedId = useModelsStorage(s => s.selectedId)

  const items = useMemo(() => models.map(m => ({
    id: m.instanceId,
    label: m.name,
    icon: WidgetsIcon,              // **component** olarak veriyoruz
    // children: (m.children || []).map(ch => ({
    //   id: ch.id.toString(),
    //   label: ch.name,
    //   icon: WidgetsIcon,            // istersen farklı ikon
    // }))
  })), [models, selectedId])

  return (
    <RichTreeView
      items={items}
      selectedItems={selectedId ? [selectedId.toString()] : []}
      onSelectedItemsChange={(_, val) => {
        const idStr = Array.isArray(val) ? val[0] : val
        // modelId olarak number saklıyoruz
        select(idStr)
      }}
      slots={{
        expandIcon: ChevronRightIcon,
        collapseIcon: ExpandMoreIcon,
      }}
      sx={{
        height: '100%',
        '& .MuiTreeItem-label': { color: 'white' },
        '& .Mui-selected > .MuiTreeItem-label': { fontWeight: 'bold' },
      }}
    />
  )
}
