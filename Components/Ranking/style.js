import { SxProps } from '@mui/material'

/**
 * @type {SxProps}  
 */

export const style = {
    item: {
        display: 'flex', alignItems: 'center', flexDirection: 'column', mb: 1, cursor: 'pointer', borderRadius: '4px',
        mr: 2,
    },
    label: { fontSize: 10, fontWeight: 500, ml: 1 },
    errorLabel: { color: 'red', fontSize: 11, marginTop: '4px' }
}