import { SxProps } from '@mui/material'

/**
 * @type {SxProps}  
 */

export const style = {
    item: {
        display: 'flex', alignItems: 'center', mb: 1, cursor: 'pointer', borderRadius: '4px',
        px: 2, py: 1, mr: 1, border: '1px solid #1414171A', ":hover": { background: '#E6F1FF' }
    },
    label: { fontSize: 14, fontWeight: 500, ml: 1 },
    errorLabel: { color: 'red', fontSize: 11, marginTop: '4px' }
}