import { Box } from '@mui/material'
import ConfigurationScene from '../scenes/ConfigurationScene'
import SideMenu from '../components/r3f-components/side-menu'
import TopToolbar from '../components/r3f-components/top-toolbar'
import { ModelInfoCard } from '../components/r3f-components/ModelInfoCard'
import BottomLeftSideMenu from '../components/r3f-components/bottom-left-side-menu/BottomLeftSideMenu'
import BottomToolbar from '../components/r3f-components/bottom-toolbar/BottomToolbar'


const ConfigurationPage = () => {
    return (
        <Box sx={{ position: "relative", width: "100vw", height: "100vh" }}>

            <ConfigurationScene />
            <SideMenu />
            <BottomLeftSideMenu />
            <TopToolbar />
            <ModelInfoCard />
            <BottomToolbar />
            {/* <SceneSettingsMenu/> */}
        </Box>
    )
}
export default ConfigurationPage