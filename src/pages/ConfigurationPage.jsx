import { Box } from '@mui/material'
import ConfigurationScene from '../scenes/ConfigurationScene'
import SideMenu from '../components/r3f-components/side-menu'
import TopToolbar from '../components/r3f-components/top-toolbar'
import { ModelInfoCard } from '../components/r3f-components/ModelInfoCard'


const ConfigurationPage = () => {
    return (
        <Box sx={{ position: "relative", width: "100vw", height: "100vh" }}>

            <ConfigurationScene >

            </ConfigurationScene>
            <SideMenu />
            <TopToolbar />
            <ModelInfoCard />
            {/* <SceneSettingsMenu/> */}
        </Box>
    )
}
export default ConfigurationPage