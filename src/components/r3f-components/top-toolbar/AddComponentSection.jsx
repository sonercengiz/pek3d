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
import { PreviewModelProvider } from '@wi3n/core'
import { PreviewModel } from '@wi3n/core'
import { getComponentList } from '../../../services/ComponentService'
import { MODELS_BASE_PATH } from '../../../utils/api'

const AddComponentSection = () => {
  const [components, setComponents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getComponentList()
      .then(res => { setComponents(res.data); setIsLoading(false) })
      .catch(err => { setError(err); setIsLoading(false) })
  }, [])

  return (
    <Box
      onClick={e => e.stopPropagation()}
      sx={{
        position: 'relative',
        width: 900,
        height: 650,
        bgcolor: '#000000CC',
        borderRadius: 2,
        p: 2,
        boxShadow: 24,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 1) Search Bar: provider'ın dışında, üst katmanda */}
      <TextField
        variant="outlined"
        placeholder="Search components..."
        size="small"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          mb: 2,
          width: '100%',
          backgroundColor: '#000',       // opak yapıyoruz
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.7)' },
            '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,1)' }
          },
          '& .MuiInputBase-input': { color: 'white' },
          '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
          '& .MuiInputLabel-root.Mui-focused': { color: 'rgba(255,255,255,1)' }
        }}
        slotProps={{
          startAdornment: (
            <Box sx={{ color: 'rgba(255,255,255,0.5)', mr: 1 }}>
              <i className="fas fa-search" />
            </Box>
          )
        }}
      />

      {/* 2) Sadece burayı sarıyoruz: PreviewModelProvider  scrollable area */}
      <Box
        sx={{
          position: 'relative',
          flex: 1,              // TextField dışındaki tüm kalan alan
          overflow: 'hidden',       // canvas  grid burada kırpılacak
        }}
      >
        <PreviewModelProvider fps={90}>
          <Box
            sx={{
              height: '100%',
              overflowY: 'auto',     // yalnızca grid scroll etsin
              p: 1
            }}
          >
            <Grid container spacing={2} alignItems="stretch" >
              {components.map(c => (
                <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 3 }} key={c.id}>
                  <Paper
                    sx={{

                      display: 'flex',             // 👈 use flex layout
                      flexDirection: 'column',     // 👈 stack children vertically
                      alignItems: 'center',        // 👈 center horizontally
                      justifyContent: 'space-between',
                      height: '100%',              // 👈 fill the grid-item height
                      textAlign: 'center',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                      p: 1
                    }}
                  >
                    <PreviewModel
                      modelPath={`${MODELS_BASE_PATH}${c.path}`}
                      scale={[0.001, 0.001, 0.001]}      // ihtiyacınıza göre
                      position={[0, 0, 0]}            // ihtiyacınıza göre
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

      {/* Error / Loading / Empty states */}
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
