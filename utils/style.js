import { SxProps } from '@mui/material'

/**
 * @type {SxProps}  
 */

export const editStyle = {
    container: { width: '100%' },
    mainContainer: { maxHeight: 'calc(100vh - 100px)', overflowY: 'scroll' },
    formWrapper: { maxWidth: { xs: '95%', sm: '70%', lg: '50%' }, mx: 'auto', mt: 4 },
    form: { width: '100%', marginBottom: '36px' },
    formChild: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' },
    itemWrapper: { mb: 2, width: '100%' },
    conferenceWrapper: {
        mb: 2, width: '100%', border: '1px solid #1414171A', boxShadow: '0px 8px 16px 0px #0000000F',
    },
    conferenceTitle: {
        textTransform: 'uppercase', color: 'primary.main', fontSize: 14,
        textAlign: 'center', width: '100%', py: 1, mb: 1, fontWeight: 600
    },
    flexbox: { display: 'flex', flexDirection: 'column' },
    conference: {
        maxWidth: '100%', mb: 1, textTransform: 'uppercase',
        bgcolor: '#F5F5F5', px: 2, py: 1, fontSize: 13, fontWeight: 600
    },
    conferenceList: { px: 2, py: .5 },
    sectionWrapper: { width: '100%', mt: 2 },
    occurenceHeading: {
        textTransform: 'capitalize', color: 'primary.main', fontSize: 14,
        py: 1, fontWeight: 600, width: '97%', px: 1, bgcolor: '#E6F1FF', mb: 2,
    },
    frequency: { mb: 2, width: '100%', position: 'relative' },
    overlay: { position: 'absolute', background: '#34343413', top: 0, left: 0, right: 0, bottom: 0, zIndex: 111 },
    liveLink: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    date: { mb: 2, width: '100%', position: 'relative' },
    monthDate: { display: 'flex', alignItems: 'center', width: '100%' },
    everyMonth: {
        ml: 2, fontSize: 13, minWidth: 'max-content', fontWeight: 400
    },
    day: { display: 'flex', alignItems: 'flex-start', mt: 2, width: '100%' },
    dayCheckbox: { mt: 1.5, mr: 2 },
    position: { width: '200px', mr: 2 },
    everyMonth2: { ml: 2, fontSize: 13, mt: 1.5, fontWeight: 400 },
    closeIcon1: { ml: 2, fontSize: 18, cursor: 'pointer', color: 'red' },
    closeIcon2: { color: 'red', cursor: 'pointer', fontSize: 18, },
    duration: { display: 'flex', mb: 2, alignItems: 'flex-start', width: '100%', justifyContent: 'space-between' },
    dropdownWrapper: { mr: 2, width: '100%' },
    dropdownWrapper2: { ml: 2, width: '100%' },
    endDate: { mb: 2, width: '100%', mt: 2, position: 'relative' },
    buttonRow: {
        display: 'flex', alignItems: 'center', mt: 4, justifyContent: 'center', maxWidth: '100%'
    },
    cancel: { borderRadius: '24px', mr: 4 }
}

export const dataStyle = {
    container: {
        display: 'flex', py: .5, border: '1px solid #1414171A', borderRadius: '8px',
        bgcolor: '#F5F5F5', mb: 1.5, mr: 2
    },
    label: { color: 'primary.main', fontWeight: 500, mb: .5, mx: 1.5, fontSize: 14 },
    valueWrapper: { display: 'flex', alignItems: 'center', mr: 1.5 },
    avatar: { height: 25, width: 25, mr: 1 }
}

export const indexStyle = {
    tabButton: {
        fontSize: '12px', px: 2, py: 1, cursor: 'pointer', borderRight: '2px solid #F3F3F3',
        minWidth: 'max-content', display: 'flex', alignItems: 'center'
    },
    container: { width: '100%', height: '100%', overflow: 'hidden' },
    tabButtonWrapper: {
        display: 'flex', alignItems: 'center',
        borderRight: '1px solid #1C1D221A', maxWidth: '99%', overflowX: 'auto', flexWrap: 'wrap'
    },
    tableWrapper: { height: 'calc(100vh - 100px)', width: '100%' }
}

export const singleStyle = {
    container: { width: '100%' },
    wrapper: {
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        maxWidth: { xs: '95%', sm: '70%', lg: '50%' }, mx: 'auto', px: 2, py: 2, my: 4,
        border: '1px solid #1414171A', borderRadius: '16px', boxShadow: '0px 8px 16px 0px #0000000F'
    },
    dateStatus: {
        display: 'flex', width: '100%', p: 0, m: 0, alignItems: 'center', justifyContent: 'space-between'
    },
    details: {
        display: 'flex', width: '100%', alignItems: 'flex-start', flexWrap: 'wrap',
    }
}

export const mappingStyle = {
    modal: {
        display: 'flex', justifyContent: 'flex-end'
    },
    container: {
        display: 'flex', flexDirection: 'column', bgcolor: 'white', width: '70vw', height: '100vh'
    },
    headingWrapper: {
        display: 'flex', alignItems: 'center', py: 2, px: 3, borderBottom: '1px solid #1414171A',
    },
    title: { color: 'primary.main', fontWeight: 700, fontSize: 16 },
    remove: {
        fontSize: 13, py: .5, px: 2, color: 'red', border: '1px solid red',
        fontWeight: 600, borderRadius: '24px', mr: 2, bgcolor: 'white'
    },
    map: { fontSize: 13, py: .5, px: 2, fontWeight: 600, borderRadius: '24px' },
    closeIcon: { fontSize: 30, cursor: 'pointer', ml: 2, mr: 1 },
    date: { py: 2, px: 2, width: '70%', mx: 'auto' },
    dateInput: {
        fontSize: 14, height: 'inherit', background: 'white', fontWeight: 500
    },
    tableWrapper: { height: 'calc(100vh - 100px)', width: '100%' }
}