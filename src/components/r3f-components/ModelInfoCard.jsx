import { Box, Divider, Fade, Grid, Typography } from '@mui/material'
import { useModelsStorage } from '@wi3n/core'
import React, { useEffect, useState } from 'react'

export const ModelInfoCard = () => {
  const { getSelectedModel } = useModelsStorage()

  return (
    <Fade in={getSelectedModel() !== null} timeout={500}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 1,
          width: 220,
          minHeight: 400,
          bgcolor: "rgba(0, 0, 0, 0.8)",
          p: 0,
          m: 2,
          borderRadius: 2,
          color: "#E8E8E8",
          visibility: getSelectedModel() !== null ? 'visible' : 'hidden'
        }}
      >
        <Box sx={{ px: 2, pt: 2 }}>
          <Typography variant="subtitle" sx={{ fontWeight: "bold", textAlign: "center" }}>
            Model Info
          </Typography>
        </Box>


        <Divider sx={{ background: "#AAAAAA", my: 1 }} component="div" />


        <Grid container spacing={0} sx={{ px: 2 }}>
          <Grid size={12}>
            <Typography variant="caption" gutterBottom sx={{ display: 'block' }}><b>Instance ID:</b> {getSelectedModel()?.instanceId}</Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="caption" gutterBottom sx={{ display: 'block' }}><b>Model ID:</b> {getSelectedModel()?.id}</Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="caption" gutterBottom sx={{ display: 'block' }}><b>Name:</b> {getSelectedModel()?.name}</Typography>
          </Grid>
          {/* <Grid size={12}>
            <Typography variant="caption" gutterBottom sx={{ display: 'block' }}>Width: {selectedModelDimensions?.width.toFixed(2)} m</Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="caption" gutterBottom sx={{ display: 'block' }}>Height: {selectedModelDimensions?.height.toFixed(2)} m</Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="caption" gutterBottom sx={{ display: 'block' }}>Depth: {selectedModelDimensions?.depth.toFixed(2)} m</Typography>
          </Grid> */}

        </Grid>
      </Box>
    </Fade >
  )
}
