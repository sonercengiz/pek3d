import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ConfigurationPage from './pages/ConfigurationPage'
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from './theme/theme';
import { ModelPreviewProvider } from '@wi3n/core'

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ModelPreviewProvider>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<ConfigurationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ModelPreviewProvider>
    </ThemeProvider>
  )
}

export default App