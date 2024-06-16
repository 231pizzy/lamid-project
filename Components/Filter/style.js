import { SxProps } from '@mui/material'

/**
 * @type {SxProps} emailEditStyle 
 */

export const checkboxStyle = {
    container: {
        display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start'
    },
    itemContainer: {
        display: 'flex', alignItems: 'flex-start', fontWeight: 400, border: '1px solid #1414171A',
        width: 'max-content', textTransform: 'capitalize', cursor: 'pointer',
        lineHeight: '20px', mb: 1, bgcolor: '#F5F9FF', px: 1, py: .5, mr: 1.5
    },
    filled: { color: 'primary.main', },
    notFilled: { color: '#1414171A' },
    label: {
        mx: 1, display: 'flex', maxWidth: '80%', mt: .5, fontSize: 13, alignItems: 'flex-start',
    },
    renderer: {
        mx: 1, mt: .2, display: 'flex', alignItems: 'flex-start',
    }
}

export const durationStyle = {
    durationContainer: {
        display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start'
    },
    wrapper: {
        display: 'flex', mb: 2, alignItems: 'flex-start', maxWidth: '100%', justifyContent: 'space-between'
    },
    dropdown: { mr: 1, maxWidth: '100%' },
    dropdownField: { ml: 0, maxWidth: '100%' }
}

export const FilterApplyStyle = {
    button: { maxWidth: 'max-content', mx: 'auto', borderRadius: '24px', mt: 4, mb: 2 }
}

export const FilterElementStyle = {
    container: {
        py: 1, maxWidth: '100%'
    },
    label: {
        color: '#282828', display: 'flex', textTransform: 'capitalize',
        fontSize: 13, mb: 1, fontWeight: 600
    }
}

export const textBoxStyle = {
    field: {
        height: '30px', fontSize: 12, py: 1, maxWidth: '100%', border: '.5px solid grey'
    }
}

export const avatarWithNameStyle = {
    container: {
        display: 'flex', alignItems: 'center', height: '100%'
    },
    avatar: { height: '20px', width: '20px' },
    name: { fontSize: 13 }
}

export const filterStyle = {
    container: { width: 'max-content', position: 'relative' },
    headingContainer: {
        height: '100vh', overflow: 'hidden', background: 'white', width: '30vw',
        position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 237273
    },
    wrapper: {
        borderBottom: '1px solid #1414171A', px: 1.5, py: 1,
        display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between'
    },
    title: { color: 'primary.main', fontWeight: 700 },
    resetWrapper: { display: 'flex', alignItems: 'center' },
    reset: {
        px: 1, py: .5, cursor: 'pointer', mr: 1.5, borderRadius: '16px', fontSize: 13
    },
    closeIcon: { fontSize: 20, cursor: 'pointer', mr: 2, color: 'black' },
    bodyWrapper: {
        pl: 2, py: 1, maxWidth: '100%', height: 'calc(100vh - 60px)', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
    },
    categoriesWrapper: { maxWidth: '100%' },
    categoryItem: { mb: 1.5 },
    categoryLabel: {
        display: 'flex', alignItems: 'center', px: 1.5, py: 1,
        justifyContent: 'space-between', background: '#FAF7F1', cursor: 'pointer'
    },
    filterElementWrapper: { px: .5 }
}

export const mediaStyle = {
    container: {
        color: 'black', fontSize: '12px', display: 'flex', alignItems: 'center'
    }
}