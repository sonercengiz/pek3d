import React from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useModelsStorage } from '@wi3n/core'

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
  const model = useModelsStorage(s => s.getSelectedModel())
  if (!model) return null

  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 10,
          width: 240,
          bgcolor: 'rgba(0,0,0,0.8)',
          m: 2,
          p: 2,
          borderRadius: 2,
          color: '#E8E8E8',
        }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          Model Info
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

        <Divider sx={{ background: '#555', my: 2 }} />

        {['position', 'rotation', 'scale'].map(prop => (
          <Box key={prop} sx={{ mb: 1 }}>
            <Typography variant="caption" fontWeight={"bold"} sx={{ mb: 0.5 }}>
              {prop.charAt(0).toUpperCase() + prop.slice(1)}
            </Typography>
            <Grid container spacing={1}>
              {model[prop].map((_, idx) => (
                <Grid item size={{ xs: 4, md: 4 }} key={idx}>
                  <AxisInput prop={prop} idx={idx} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    </Fade>
  )
}
