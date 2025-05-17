import { Box } from '@mui/material'
import ConfigurationScene from '../scenes/ConfigurationScene'
import SideMenu from '../components/r3f-components/side-menu'
import TopToolbar from '../components/r3f-components/top-toolbar/TopToolbar'


const ConfigurationPage = () => {
    return (
        <Box sx={{ position: "relative", width: "100vw", height: "100vh" }}>

            <ConfigurationScene />
            <SideMenu />
            <TopToolbar />
            {/* <SceneSettingsMenu/> */}
        </Box>
    )
}
export default ConfigurationPage