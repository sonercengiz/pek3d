import { Box, CircularProgress, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ModelPreview from '../../../@core/components/model-preview/ModelPreview'
import { MODELS_BASE_PATH } from '../../../utils/api';
import { getComponentList } from '../../../services/ComponentService';

const MenuContent = () => {
  // fetch components from api
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

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', height: '100vh' }}>
          <CircularProgress sx={{ 'color': '#e6e6e6', mt: 5 }} />
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', height: '100vh' }}>
          <Typography variant="h6" color="error">
            Error: {error.message}
          </Typography>
        </Box>
      ) : (
        components.map((component) => (
          <Paper
            key={component.id}
            draggable
            // onDragStart={(event) => handleDragStart(event, model)}
            sx={{
              my: 1,
              mx: 2,
              textAlign: "center",
              cursor: "grab",
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
        ))
      )}
    </>


  )
}

export default MenuContent