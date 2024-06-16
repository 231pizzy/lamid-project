'use client'

import { Avatar, Box, Typography, } from "@mui/material";

import Close from '@mui/icons-material/Close';


import { useEffect, useState, } from "react";
import { useSelector } from "react-redux";

import moment from "moment";

const backgroundImage = '/images/image-1.png'

const staffProfile = {
    fullName: 'Daniel Peter',
    email: 'jjsdkg@gmail.com',
    profilePicture: backgroundImage,
    role: 'C.E.O.',
    workExperience: [
        {
            role: 'Lead Engineer',
            company: 'Microsoft',
            startDate: '18-06-2022',
            endDate: '29-08-2022',
            description: 'Lorem ipsum dolor sit amet consectetur. Euismod dignissim lorem condimentum \
            non egestas adipiscing nunc et. Mauris turpis maecenas et proin scelerisque quisque eget.\
             Pharetra a tortor cursus aliquam justo in ante. Vitae libero non fringilla morbi lorem dui\
              mauris morbi accumsan.   Vulputate duis a eu consectetur. Vestibulum morbi fames sem \
              vitae. Lacus non aliquet gravida sed enim id.Lorem ipsum dolor sit amet consectetur. Euismod dignissim lorem condimentum \
              non egestas adipiscing nunc et. Mauris turpis maecenas et proin scelerisque quisque eget.\
               Pharetra a tortor cursus aliquam justo in ante. Vitae libero non fringilla morbi lorem dui\
                mauris morbi accumsan.   Vulputate duis a eu consectetur. Vestibulum morbi fames sem \
                vitae. Lacus non aliquet gravida sed enim id.',
        },
        {
            role: 'Manager',
            company: 'Apple',
            startDate: '18-01-2019',
            endDate: '22-10-2020',
            description: 'Lorem ipsum dolor sit amet consectetur. Euismod dignissim lorem condimentum \
            non egestas adipiscing nunc et. Mauris turpis maecenas et proin scelerisque quisque eget.\
             Pharetra a tortor cursus aliquam justo in ante. Vitae libero non fringilla morbi lorem dui\
              mauris morbi accumsan.   Vulputate duis a eu consectetur. Vestibulum morbi fames sem \
              vitae. Lacus non aliquet gravida sed enim id.',
        },
    ],
    education: [
        {
            school: 'University of Benin',
            course: 'Computer Science',
            certificate: 'Bsc',
            startDate: '12-04-2020',
            endDate: '24-09-2021',
            description: 'Lorem ipsum dolor sit amet consectetur. Euismod dignissim lorem condimentum \
            non egestas adipiscing nunc et. Mauris turpis maecenas et proin scelerisque quisque eget.\
             Pharetra a tortor cursus aliquam justo in ante. Vitae libero non fringilla morbi lorem dui\
              mauris morbi accumsan.   Vulputate duis a eu consectetur. Vestibulum morbi fames sem \
              vitae. Lacus non aliquet gravida sed enim id.'
        }
    ],
    languages: ['English', 'Hausa', 'French', 'Chinese', 'Igbo'],
    skills: ['Microsoft Office', 'Linux', 'Adobe Photoshop', 'Figma', 'Cooking', 'data analysis']
}

const sectionData = [
    { heading: 'Experience', key: 'workExperience', institutionKey: 'company', roleKey: 'role', },
    { heading: 'Education', key: 'education', institutionKey: 'school', roleKey: 'course', },
]

const skillsLanguageData = [
    { heading: 'Skills', key: 'skills', },
    { heading: 'Languages', key: 'languages', },
]

function Profile(prop) {

    const savedFormData = useSelector(state => state.newProjectGroup.projectData);
    const savedFilters = useSelector(state => state.newProjectGroup.projectGroupFilters);

    useEffect(() => {
        console.log("already saved form data is ", savedFormData);
        console.log("already saved filter is", savedFilters);
    }, [savedFilters, savedFormData])


    const [state, setState] = useState({
        staffProfile: prop.staffProfile
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    const closeProfile = (event) => {
        prop.closeProfile();
    }

    console.log('state', state);

    return (
        <Box sx={{
            height: '80%', transform: 'translate(-50%,-50%)', bgcolor: 'white', overflow: 'hidden', borderRadius: '16px',
            position: 'absolute', top: '50%', pb: 6, left: '50%', width: { xs: '90%', sm: '80%', md: '70%', lg: '50%', xl: '50%' },
        }}>
            {/*Fixed Heading */}
            <Box sx={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1,
                borderBottom: '1px solid rgba(28, 29, 34, 0.1)', alignItems: 'center', pt: 2,
            }}>
                {/* Heading */}
                <Box sx={{ display: 'flex', px: { xs: 1.5, md: 3 }, mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Name,position, profile picture,email */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Profile picture */}
                        <Avatar
                            sx={{ width: '70px', height: '70px', mr: 2 }}
                            src={state.staffProfile.profilePicture} />
                        {/* Name,email,position */}
                        <Box>
                            {/* Full name */}
                            <Typography sx={{ fontWeight: 700, fontSize: { xs: 14, md: 17 } }}>
                                {state.staffProfile.name}
                            </Typography>
                            {/* Email */}
                            <Typography sx={{ fontWeight: 500, fontSize: { xs: 11, md: 14 }, my: .4, color: '#8D8D8D' }}>
                                {state.staffProfile.email}
                            </Typography>
                            {/* Role */}
                            <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, md: 16 }, color: '#BF0606' }}>
                                {state.staffProfile.role}
                            </Typography>
                        </Box>
                    </Box>
                    {/* Close profile button */}
                    <Close onClick={closeProfile} sx={{ cursor: 'pointer', color: '#8D8D8D', fontSize: 30, mr: 2 }} />
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                {/* Sub heading */}
                <Typography sx={{
                    px: { xs: 1.5, md: 3 }, py: .6, fontWeight: 600, fontSize: { xs: 13, md: 16 },
                    bgcolor: 'rgba(191, 6, 6, 0.08)', color: 'rgba(191, 6, 6, 0.8)'
                }}>
                    Qualification
                </Typography>

            </Box>

            {/* Content */}
            <Box sx={{ mt: 18, maxHeight: '80%', overflowY: 'scroll', px: { xs: 1.5, md: 3 } }}>
                {/* Experience and education section */}
                {sectionData.map(section =>
                    <Box sx={{ mt: 2 }}>
                        {/* Section heading */}
                        <Typography sx={{ fontWeight: 600, fontSize: { xs: 13, md: 16 }, color: '#BF0606' }}>
                            {section.heading}
                        </Typography>
                        {/* Section body */}
                        {staffProfile[section.key].map(item =>
                            <Box sx={{ mt: 1.5 }}>
                                {/* Role */}
                                <Typography sx={{ fontWeight: 700, fontSize: { xs: 12, md: 14 }, mb: .5 }}>
                                    {section.key === 'education' && `${item.certificate}.`} {item[section.roleKey]}
                                </Typography >
                                {/* Institution name */}
                                <Typography sx={{ fontWeight: 500, fontSize: { xs: 12, md: 14 }, mb: .5 }}>
                                    {item[section.institutionKey]}
                                </Typography>
                                {/* Start and end dates */}
                                <Typography sx={{ fontWeight: 500, fontSize: { xs: 11, md: 13 }, mb: 1, color: '#8D8D8D' }}>
                                    {moment(item.startDate, 'DD-MM-yyyy')
                                        .format('MMM yyyy')} -   {moment(item.endDate, 'DD-MM-yyyy').format('MMM yyyy')}
                                </Typography>
                                {/* summary */}
                                <Typography align='justify' sx={{ fontWeight: 500, fontSize: { xs: 11, md: 13 }, }}>
                                    {item.description}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
                {/* Skills and languages */}
                <Box sx={{ mt: 2, justifyContent: 'flex-start', display: 'flex', flexWrap: 'wrap' }}>
                    {skillsLanguageData.map(section =>
                        <Box sx={{ px: 3, py: 1, mr: 8, borderRadius: '10px', border: '1px solid rgba(28, 29, 34, 0.1)' }}>
                            {/* Section heading */}
                            <Typography sx={{ fontWeight: 600, fontSize: { xs: 13, md: 16 }, color: '#BF0606', mb: 1 }}>
                                {section.heading}
                            </Typography>
                            {staffProfile[section.key].map(item =>
                                <Typography sx={{ fontWeight: 500, fontSize: { xs: 12, md: 14 }, mt: .3 }}>
                                    {item}
                                </Typography>
                            )}
                        </Box>
                    )}

                    {/* Languages */}
                </Box>
            </Box>


        </Box>)
}

export default Profile;