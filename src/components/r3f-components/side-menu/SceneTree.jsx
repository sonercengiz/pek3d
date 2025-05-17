// src/components/SideMenu/SceneTree.jsx
import React, { useMemo } from 'react'
import { RichTreeView } from '@mui/x-tree-view'
import WidgetsIcon from '@mui/icons-material/Widgets'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useModelsStorage } from '@wi3n/core'
import { useSelectionStorage } from '@wi3n/core'

export default function SceneTree() {
  const models = useModelsStorage(s => s.models)
  const select = useSelectionStorage(s => s.select)
  const selected = useSelectionStorage(s => s.selectedId)

  // models içinde children yoksa boş array veriyoruz
  const items = useMemo(() => models.map(m => ({
    id: m.id.toString(),
    label: m.name,
    // eğer child geometry’leriniz varsa burada map edin:
    children: (m.children || []).map(ch => ({
      id: ch.id.toString(),
      label: ch.name,
    }))
  })), [models])

  return (
    <RichTreeView
      items={items}

      // İkonlarımızı slots içinde tanımlıyoruz
      slots={{
        expandIcon: ChevronRightIcon,
        collapseIcon: ExpandMoreIcon,
      }}
      // Yaprak (leaf) öğeler için ikon
      defaultEndIcon={<WidgetsIcon fontSize="small" />}

      // Seçili öğe kontrolü
      selectedItems={selected != null ? [selected.toString()] : []}
      onSelectedItemsChange={(_, val) => {
        const idStr = Array.isArray(val) ? val[0] : val
        select(Number(idStr))
      }}

      // Stil ayarları
      slotProps={{
        root: {
          sx: {
            height: '100%',
            overflowY: 'auto',
            // metin renkleri
            '& .MuiTreeItem-label': { color: 'white' },
            '& .MuiTreeItem-content.Mui-selected > .MuiTreeItem-label': {
              fontWeight: 'bold'
            }
          }
        }
      }}
    />
  )
}
