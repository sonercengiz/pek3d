import React from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useModelsStorage } from 'wi3n-core'
import { Checkbox, FormControlLabel, Tab, Tabs } from '@mui/material'
import { useSettingsStorage } from '../../storage/SceneStorage'

// Tekrar render’ı önlemek için memoize edilmiş input bileşeni
const AxisInput = React.memo(({ prop, idx }) => {
  const selectedId = useModelsStorage(s => s.selectedId)
  const model = useModelsStorage(s => s.getSelectedModel())
  const updateTransform = useModelsStorage(s => s.updateModelTransform)

  const value = model?.[prop][idx] ?? 0
  const step = 0.05

  const handleChange = e => {
    const v = parseFloat(e.target.value.replace(',', '.'))
    if (isNaN(v)) return
    const arr = [...model[prop]]
    arr[idx] = v
    updateTransform(selectedId, { [prop]: arr })
  }

  const handleIncrement = () => {
    const v = parseFloat((value + step).toFixed(2))
    const arr = [...model[prop]]
    arr[idx] = v
    updateTransform(selectedId, { [prop]: arr })
  }

  const handleDecrement = () => {
    const v = parseFloat((value - step).toFixed(2))
    const arr = [...model[prop]]
    arr[idx] = v
    updateTransform(selectedId, { [prop]: arr })
  }

  return (
    <Box
      component="label"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1
      }}
    >
      <Typography
        variant="caption"
        sx={{ color: '#AAA', fontSize: '0.7rem', mb: 0.3 }}
      >
        {['X', 'Y', 'Z'][idx]}
      </Typography>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1',
          border: '1px solid #555',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 1
        }}
      >
        <input
          type="text"
          value={String(value).replace('.', ',')}
          onChange={handleChange}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            textAlign: 'center',
            color: '#E8E8E8',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <IconButton size="small" onClick={handleIncrement} sx={{ p: 0, mb: 1.5 }}>
            <ArrowDropUpIcon sx={{ fontSize: '1.2rem', color: '#E8E8E8' }} />
          </IconButton>
          <IconButton size="small" onClick={handleDecrement} sx={{ p: 0, mt: 1.5 }}>
            <ArrowDropDownIcon sx={{ fontSize: '1.2rem', color: '#E8E8E8' }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}, (prev, next) => prev.prop === next.prop && prev.idx === next.idx)


export const ModelInfoCard = () => {
  // 1. Hooks en üstte
  const [tab, setTab] = React.useState(0)
  const model = useModelsStorage(s => s.getSelectedModel())
  const updateProp = useModelsStorage(s => s.updateModelProp)
  const { setTransformEditorType } = useSettingsStorage()

  if (!model) return null

  // model.showWireframe ön tanımlı true
  const { showWireframe = true } = model

  const handleTab = (_e, v) => {
    setTab(v)
    console.log(v)
    switch (v) {
      case 0: // position
        setTransformEditorType('translate')
        break
      case 1: // rotation
        setTransformEditorType('rotate')
        break
      case 2: // scale
        setTransformEditorType('scale')
        break
      default:
        setTransformEditorType('translate')
        break
    }

  }

  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          position: 'absolute', top: 0, right: 0, zIndex: 10,
          width: 240, bgcolor: 'rgba(0,0,0,0.8)',
          m: 2, p: 2, borderRadius: 2, color: '#E8E8E8'
        }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          {model.name}
        </Typography>
        <Divider sx={{ background: '#555', mb: 2 }} />

        <Typography variant="caption" display="block">
          <strong>Instance ID:</strong> {model.instanceId}
        </Typography>
        <Typography variant="caption" display="block">
          <strong>Model ID:</strong> {model.id}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          <strong>Name:</strong> {model.name}
        </Typography>

        <Divider sx={{ background: '#555', mt: 1 }} />

        {/* 2. Sekmeler */}
        <Tabs
          value={tab}
          onChange={handleTab}
          variant="standard"           // or omit variant to use 'standard'
          scrollButtons="auto"
          allowScrollButtonsMobile
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            // globally override each Tab
            '& .MuiTab-root': {
              minWidth: 'auto',          // don't enforce 120px default
              // px: 1,                     // small horizontal padding
              fontSize: '12px',
              p: 0,
              mx: 1,
            }
          }}
        >
          <Tab label="Position" value={0} />
          <Tab label="Rotation" value={1} />
          <Tab label="Scale" value={2} />
        </Tabs>

        {/* 3. Paneller */}
        {tab === 0 && (
          <Grid container spacing={1} >
            {model.position.map((_, i) => (
              <Grid item size={4} key={i}>
                <AxisInput prop="position" idx={i} />
              </Grid>
            ))}
          </Grid>
        )}
        {tab === 1 && (
          <Grid container spacing={1}>
            {model.rotation.map((_, i) => (
              <Grid item size={4} key={i}>
                <AxisInput prop="rotation" idx={i} />
              </Grid>
            ))}
          </Grid>
        )}
        {tab === 2 && (
          <Grid container spacing={1}>
            {model.scale.map((_, i) => (
              <Grid item size={4} key={i}>
                <AxisInput prop="scale" idx={i} />
              </Grid>
            ))}
          </Grid>
        )}
        <Divider sx={{ background: '#555', mt: 1 }} />
        {/* wireframe toggle */}
        <FormControlLabel
          control={
            <Checkbox
              checked={showWireframe}
              onChange={e =>
                updateProp(model.instanceId, { showWireframe: e.target.checked })
              }
              size="small"
              sx={{
                color: '#E8E8E8',
                '&.Mui-checked': { color: '#E8E8E8' }
              }}
            />
          }
          label={
            <Typography variant="caption" sx={{ color: '#E8E8E8' }}>
              Show Wireframe
            </Typography>
          }
          sx={{ mb: 2 }}
        />
      </Box>
    </Fade>
  )
}
