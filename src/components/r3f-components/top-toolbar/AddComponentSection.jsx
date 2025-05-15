import React, { useEffect, useState } from 'react'
import { getComponentList } from '../../../services/ComponentService';
import { Box, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import { ModelPreview } from '@wi3n/core'

import { MODELS_BASE_PATH } from '../../../utils/api';

const AddComponentSection = () => {
  const [components, setComponents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getComponentList()
      .then((response) => {
        setComponents(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }
    , []);
  return (
    <>
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: 900,
          height: 600,
          bgcolor: '#000000CC',
          borderRadius: 2,
          p: 2,
          boxShadow: 24,
          position: 'relative',
        }}
      >
        <Grid container spacing={2} sx={{ scrollY: 'auto', maxHeight: '100%', overflowY: 'auto' }}>
          {components.map((component) => (
            <Grid item size={3} key={component.id}>
              <Paper
                sx={{
                  textAlign: "center",
                  cursor: "pointer",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                  borderRadius: 1,
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <ModelPreview modelPath={`${MODELS_BASE_PATH}/${component.name}`} scale={0.001} targetPosition={[0, 0.7, 0]} backgroundColor='#cfcfcf' spinSpeed={0.3} />
                <Typography variant="subtitle" fontSize="14px">
                  {component.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        {error && (
          <Box sx={{ display: 'flex', justifyContent: 'center', height: '100vh' }}>
            <Typography variant="h6" color="error">
              Error: {error.message}
            </Typography>
          </Box>
        )}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', height: '100vh' }}>
            <CircularProgress sx={{ 'color': '#e6e6e6', mt: 5 }} />
          </Box>
        )}
        {components.length === 0 && !isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', height: '100vh' }}>
            <Typography variant="h6" color="textSecondary">
              No components available.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  )
}

export default AddComponentSection