// src/AddComponentSection.jsx
import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  TextField
} from '@mui/material'
import { PreviewModelProvider, PreviewModel, useModelsStorage } from 'wi3n-core'
import {
  boxContainer,
  searchField,
  scrollArea,
  innerScrollBox,
  paperCard
} from './styles'
import { getComponentList } from '../../../services/ComponentService'
import { MODELS_BASE_PATH } from '../../../utils/api'

const AddComponentSection = ({ onClose }) => {
  const [components, setComponents] = useState([
    {
      id: 1,
      name: '1,2 Mal Verme Bandı',
      path: '/models/1-2-mal-verme-bandi.glb'
    },
    {
      id: 2,
      name: '1,2 Rotatif',
      path: 'models/1-2-rotatif.glb'
    },
    {
      id: 3,
      name: '300 kg Mikser',
      path: 'models/300-kg-mikser.glb'
    },
    {
      id: 4,
      name: 'Hamur Giyotin',
      path: 'models/hamur-giyotin.glb'
    },
    {
      id: 5,
      name: 'Iskarta Değirmeni',
      path: 'models/iskarta-degirmeni.glb'
    },
    {
      id: 6,
      name: 'Yerden Hamur Besleme Sistemi',
      path: 'models/yerden-hamur-besleme-sistemi.glb'
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const { addModel } = useModelsStorage()

  // useEffect(() => {
  //   getComponentList()
  //     .then(res => {
  //       setComponents(res.data)
  //       setIsLoading(false)
  //     })
  //     .catch(err => {
  //       setError(err)
  //       setIsLoading(false)
  //     })
  // }, [])

  const handleClick = (id) => {
    const component = components.find(c => c.id === id)
    if (!component) {
      console.error('Component not found:', id)
      return
    }

    const componentModel = {
      id: component.id,
      name: component.name,
      path: `${component.path}`,
    }

    addModel(componentModel, true)
    onClose?.()
  }

  return (
    <Box onClick={e => e.stopPropagation()} sx={boxContainer}>
      <TextField
        variant="outlined"
        placeholder="Search components..."
        size="small"
        sx={searchField}
        slotProps={{
          startAdornment: (
            <Box sx={{ color: 'rgba(255,255,255,0.5)', mr: 1 }}>
              <i className="fas fa-search" />
            </Box>
          )
        }}
      />

      <Box sx={scrollArea}>
        <PreviewModelProvider fps={90}>
          <Box sx={innerScrollBox}>
            <Grid container spacing={2} alignItems="stretch">
              {components.map(c => (
                <Grid
                  size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 3 }}
                  key={c.id}
                  onClick={() => handleClick(c.id)}
                >
                  <Paper sx={paperCard}>
                    <PreviewModel
                      // modelPath={`${MODELS_BASE_PATH}${c.path}`}
                      modelPath={`${c.path}`}
                      position={[0, 0, 0]}
                      width={160}
                      height={160}
                    />
                    <Typography variant="subtitle2" fontSize="14px">
                      {c.name}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </PreviewModelProvider>
      </Box>

      {error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
          <Typography variant="h6" color="error">
            Error: {error.message}
          </Typography>
        </Box>
      )}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
          <CircularProgress sx={{ color: '#e6e6e6', mt: 5 }} />
        </Box>
      )}
      {!isLoading && components.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
          <Typography variant="h6" color="textSecondary">
            No components available.
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default AddComponentSection
