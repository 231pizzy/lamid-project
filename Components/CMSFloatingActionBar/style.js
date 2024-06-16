import { SxProps } from '@mui/material'

/**
 * 
 * @type {SxProps} floatingBarStyle 
 * 
 */

export const floatingBarStyle = {
    container: {
        position: 'absolute', bottom: '150px', transform: 'translate(-50%,-50%)', justifyContent: 'space-between',
        background: '#F2F7FF', width: 'max-content', left: '50%', right: '50%', display: 'flex', alignItems: 'center',
        border: '2px solid #64A5F1', borderRadius: '16px', padding: '12px 12px',
        boxShadow: '16px 16px 24px 0px #1C1D221F, -16px -16px 24px 0px #1C1D221A'
    },
    iconButton: {
        fontSize: 11, mx: 1, py: .5, px: 1, maxWidth: 'max-content', minWidth: 0, border: '1px solid #1414171A',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#364451', borderRadius: '8px'
    },
    closeIcon: {
        fontSize: 23, color: 'primary.main', cursor: 'pointer', marginRight: '8px'
    },
    selectedLabel: {
        fontSize: '13px', fontWeight: 700, margin: '0 8px'
    }
}
