import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ConfigurationPage from './pages/ConfigurationPage'
import ProjectsPage from './pages/ProjectsPage'
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from './theme/theme';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter basename="/">
        <Routes>
          {/* <Route path='/' element={<ProjectsPage />} /> */}
          <Route path="/" element={<ConfigurationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App