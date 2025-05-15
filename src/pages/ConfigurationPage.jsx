import { Box } from '@mui/material'
import ConfigurationScene from '../scenes/ConfigurationScene'
import SceneSettingsMenu from '../components/r3f-components/SceneSettingsMenu'
import TestModel from '../models/TestModel'
import TestModel2 from '../models/TestModel2'
import SideMenu from '../components/r3f-components/side-menu'
import CustomToolbar from '../components/r3f-components/toolbar/CustomToolbar'


const ConfigurationPage = () => {
    return (
        <Box sx={{ position: "relative", width: "100vw", height: "100vh" }}>
            <ConfigurationScene>

            </ConfigurationScene>
            <SideMenu />
            <CustomToolbar />
            {/* <SceneSettingsMenu/> */}
        </Box>
    )
}
export default ConfigurationPage