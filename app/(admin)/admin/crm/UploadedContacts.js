import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from "@mui/material";

import Close from '@mui/icons-material/Close';


import 'react-international-phone/style.css'

//import { CitySelect, StateSelect, CountrySelect } from 'react-country-state-city';


/*  1. fullName,   2. company,   3. sector,   4. email,   5. phone 6. country,   7. state,   8. city,   9. street, 10. facebook, 11. twitter, 12. linkedin, 13. instagram  */
const tableHeading = ['NAME', 'COMPANY', 'SECTOR', 'EMAIL', 'PHONE',
    'COUNTRY', 'STATE', 'CITY', 'STREET', 'FACEBOOK', 'TWITTER', 'LINKEDIN', 'INSTAGRAM'
];

const keys = [
    { value: 'fullName' },
    { value: 'company' },
    { value: 'sector' },
    { value: 'email' },
    { value: 'phone' },
    { value: 'country' },
    { value: 'state' },
    { value: 'city' },
    { value: 'street' },
    { value: 'social' }
]

const social = [
    { value: 'facebook' },
    { value: 'twitter' },
    { value: 'linkedin' },
    { value: 'instagram' },
]



function UploadedContacts(prop) {
    const closeView = () => {
        prop.closeView();
    }

    return (
        <Box sx={{
            height: '80vh', transform: 'translate(-50%,-50%)', bgcolor: 'white', overflowY: 'hidden',
            position: 'absolute', top: '50%', left: '50%', width: { xs: '80%', md: '70%', lg: '90%' },
        }}>
            {/* Heading */}
            <Box sx={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1,
                display: 'flex', borderBottom: '1px solid rgba(28, 29, 34, 0.1)',
                boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', alignItems: 'center', py: 2, px: { xs: 1.5, sm: 4 }
            }}>
                {/* Heading label */}
                <Typography sx={{ textTransform: 'uppercase', fontWeight: 700, fontSize: { xs: 13, sm: 17, md: 18 } }}>
                    {prop.filename.split('.')[0]}  {prop.filename.substring(prop.filename.lastIndexOf('.') + 1)} file
                </Typography>

                <Box sx={{ flexGrow: 1 }} />
                {/* Close form */}
                <Close onClick={closeView}
                    sx={{ cursor: 'pointer', color: '#8D8D8D', fontSize: 26, }} />
            </Box>

            {/* Contacts */}
            <Box sx={{ mt: '60px', overflowY: 'hidden' }}>
                <TableContainer sx={{
                    position: 'relative', maxHeight: '65vh', overflow: 'auto',
                }}>
                    <Table stickyHeader size='small'>
                        <TableHead >
                            <TableRow sx={{ position: 'sticky', top: 0, left: 0, right: 0, width: '100%' }}>
                                <TableCell sx={{
                                    fontSize: 14, fontWeight: 700,
                                    border: '1px solid rgba(28, 29, 34, 0.15)', bgcolor: '#F5F5F5'
                                }} >
                                    S/N
                                </TableCell>
                                {tableHeading.map((data, index) =>
                                    <TableCell key={index} sx={{
                                        fontSize: 14, fontWeight: 700,
                                        border: '1px solid rgba(28, 29, 34, 0.15)', bgcolor: '#F5F5F5'
                                    }}>
                                        {data}
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>

                        <TableBody sx={{}}>
                            {state.contacts.map((contact, index) => {
                                const socialMedia = JSON.parse(contact?.social);
                                return <TableRow key={index}>
                                    <TableCell sx={{ borderRight: '1px solid rgba(28, 29, 34, 0.15)' }}>
                                        <Typography align='center' sx={{ fontSize: 14, fontWeight: 600, }}>
                                            {index + 1}
                                        </Typography>
                                    </TableCell>
                                    {keys.map((data, indx) =>
                                        data.value !== 'social' ?
                                            <TableCell key={indx} sx={{ borderRight: '1px solid rgba(28, 29, 34, 0.15)' }}>
                                                <Typography align='center' sx={{ fontSize: 14, fontWeight: 600, }}>
                                                    {contact[data.value]}
                                                </Typography>
                                            </TableCell> :
                                            social.map((data, indx) =>
                                                <TableCell key={indx} sx={{ borderRight: '1px solid rgba(28, 29, 34, 0.15)' }}>
                                                    <Typography align='center' sx={{ fontSize: 14, fontWeight: 600, }}>
                                                        {socialMedia[data.value]}
                                                    </Typography>
                                                </TableCell>
                                            )
                                    )}
                                </TableRow>
                            }

                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box >)
}

export default UploadedContacts;