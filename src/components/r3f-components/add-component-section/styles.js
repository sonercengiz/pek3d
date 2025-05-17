// src/AddComponentSection.styles.js
export const boxContainer = {
  position: 'relative',
  width: 900,
  height: 650,
  bgcolor: '#000000CC',
  borderRadius: 2,
  p: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column'
}

export const searchField = {
  position: 'sticky',
  top: 0,
  zIndex: 10,
  mb: 2,
  width: '100%',
  backgroundColor: '#000',
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.7)' },
    '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,1)' }
  },
  '& .MuiInputBase-input': { color: 'white' },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'rgba(255,255,255,1)' }
}

export const scrollArea = {
  position: 'relative',
  flex: 1,
  overflow: 'hidden'
}

export const innerScrollBox = {
  height: '100%',
  overflowY: 'auto',
  p: 1
}

export const paperCard = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '100%',
  textAlign: 'center',
  bgcolor: 'rgba(255,255,255,0.1)',
  color: 'white',
  cursor: 'pointer',
  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
  p: 1
}
