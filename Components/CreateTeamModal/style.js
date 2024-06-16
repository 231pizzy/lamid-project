import { SxProps } from '@mui/material'

/**
 * @type {SxProps}  
 */

export const modalStyle = {
    modal: {
        display: 'flex', alignitems: 'center', justifyContent: 'center'
    },
    container: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'white', my: 'auto',
        width: { xs: '90vw', sm: '40vw', lg: '30vw' }, borderRadius: '12px', height: 'max-content'
    },
    headingWrapper: {
        display: 'flex', alignItems: 'center', width: '100%', py: 1, borderBottom: '1px solid #1414171A',
        justifyContent: 'center'
    },
    title: { fontWeight: 600, width: '100%', display: 'flex', justifyContent: 'center' },
    icon: { fontSize: 18, cursor: 'pointer', mr: 1 },
    message: { py: 2, px: 2, textAlign: 'center', }
}