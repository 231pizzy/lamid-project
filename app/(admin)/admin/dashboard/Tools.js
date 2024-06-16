import { Box, Button, Grid, Typography } from "@mui/material";

import NextArrow from "@mui/icons-material/KeyboardArrowRight";
import Crm from "../crm/Crm";
import Forms from "../forms/Forms";
import ToolsDocument from "../documents/Documents";

const toolSections = [
    { label: 'Crm/Address book', value: 'crm' },
    { label: 'Forms', value: 'forms' },
    { label: 'Documents', value: 'documents' },
]


export default function Tools({ currentTool, changeToolSection, handleGoto }) {


    return <Grid item xs={12} sx={{}}>
        <Box sx={{
            borderRadius: '16px', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)',
        /* width: '100%',  */maxWidth: '100%', bgcolor: '#FFFFFF',
            border: '1px solid rgba(28, 29, 34, 0.1)', pb: 1, px: 1
        }}>
            <Box sx={{
                display: 'flex', justifyContent: 'center', py: 1.5, px: 2, alignItems: 'center',
                borderBottom: '1px solid #1C1D221A', mb: 1.5, flexWrap: 'wrap'
            }}>
                <Typography noWrap sx={{ fontWeight: 700, mr: 4 }}>
                    TOOLS
                </Typography>

                {toolSections.map((data, index) => {
                    const selected = currentTool === data.value ? 'selected' : 'unselected';
                    const styles = {
                        selected: {
                            bgcolor: '#DA4E4E', boxShadow: '0px 12px 10px 0px #BF060614',
                            color: 'white'
                        }, unselected: {
                            bgcolor: '#F3F3F3', boxShadow: '0px 8px 12px 0px #0000000A',
                            color: 'black'
                        }
                    };

                    return <Typography id={data.value} key={index} sx={{
                        mr: 2, mt: 1, py: .5, px: 1.5, fontSize: { xs: 13, md: 14 }, fontWeight: 600,
                        width: 'max-content', borderRadius: '24px', cursor: 'pointer', ...styles[selected]
                    }} onClick={changeToolSection}>
                        {data.label}
                    </Typography>
                })}

                <Box sx={{ flexGrow: 1 }} />

                <Button id={`/admin/${currentTool}`} sx={{ fontSize: { xs: 12, sm: 14 } }} onClick={handleGoto}>
                    Go to {currentTool}
                    <NextArrow fontSize="small" sx={{ ml: -.5 }} />
                </Button>
            </Box>

            {currentTool === 'crm' ? <Crm {...{ noToolbar: true }} /> : currentTool === 'forms' ?
                <Forms {...{ noToolbar: true }} /> : <ToolsDocument {...{ noToolbar: true }} />}

        </Box>
    </Grid>
}