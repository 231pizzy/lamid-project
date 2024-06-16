import { SxProps } from '@mui/material'

/**
 * @type {SxProps} emailEditStyle 
 */

export const dropdownStyle = {
    container: {
        width: '100%', display: 'flex', flexDirection: 'column',
    },
    headingContainer: {
        width: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer',
        py: .1, border: '1.5px solid #E3E3E3'
    },
    headingLabel: { ml: 2, fontSize: 15 },
    caret: { mr: 2, color: '#0E60BF' },
    itemContainer: {
        maxWidth: '100%', maxHeight: '40vh', overflowY: 'auto', overflowX: 'hidden',
        boxShadow: '0px 6.666666507720947px 13.333333015441895px 0px #0000000F',
        border: '0.83px solid #1414171A', mt: 1
    },
    item: { width: '100%', cursor: 'pointer', borderBottom: '1px solid #1414171A' }
}

export const dropdown2Style = {
    heading: { fontSize: 11, mr: .5, maxWidth: '500px', display: 'flex', alignItems: 'center' },
    headingLabel: { fontSize: 12, fontWeight: 600, color: 'primary.main', },
    value: {
        px: 1.5, py: .5, fontSize: 11, fontWeight: 600, cursor: 'pointer', textAlign: 'center',
        borderBottom: '1px solid #DEDEDE', maxWidth: '100%', background: 'white',
    }
}

export const dropdownFieldStyle = {
    container: {
        width: '100%', display: 'flex', flexDirection: 'column',
    },
    headingContainer: {
        width: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer', py: 1, border: '1.5px solid #E3E3E3'
    },
    content: {
        maxWidth: '100%', maxHeight: '40vh', overflowY: 'auto', overflowX: 'hidden',
        boxShadow: '0px 6.666666507720947px 13.333333015441895px 0px #0000000F',
        border: '0.83px solid #1414171A', mt: 2
    },
    item: { width: '100%', borderBottom: '1px solid #1414171A' },
    errorLabel: { color: 'red', fontSize: 11, marginTop: '4px' }
}

export const dropdownItemStyle = {
    container: {
        display: 'flex', alignItems: 'center', width: '100%', cursor: 'pointer', ":hover": { backgroundColor: '#F5F5F5' },
        py: 1,
    },
    icon: { minwidth: 'max-content', px: 1.5, minHeight: 'max-content', display: 'flex', alignItems: 'center' },
    avatar: { width: 30, height: 30, mx: 2 }
}