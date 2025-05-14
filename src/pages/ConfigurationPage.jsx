import { Box } from '@mui/material'
import ConfigurationScene from '../scenes/ConfigurationScene'
import SceneSettingsMenu from '../components/r3f-components/SceneSettingsMenu'
import TestModel from '../models/TestModel'
import SideMenu from '../components/r3f-components/SideMenu'


const ConfigurationPage = () => {
    return (
        <Box sx={{ position: "relative", width: "100vw", height: "100vh" }}>
            <ConfigurationScene>
                <TestModel/>
            </ConfigurationScene>
            <SideMenu/>
            {/* <SceneSettingsMenu/> */}
        </Box>
    )
}
export default ConfigurationPage