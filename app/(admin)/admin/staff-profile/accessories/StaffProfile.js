'use client'

import {
    Box, Grid, Typography, Paper, Divider,
} from "@mui/material";

import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import { setDashboardView, setPageTitle } from "@/Components/redux/routeSlice";


const profile = {
    fullName: 'Samue Eto',
    email: 'sdjh@fmail.jds',
    phone: '+2348141678734',
    profilePicture: 'default.jpg',
    role: 'Administrator',
    team: 'Management',
    projectGroups: [
        { name: 'MTN Group', projectColor: '#F34610' },
        { name: 'Firstbank group', projectColor: '#F34610' },
    ],
    workExperience: [
        {
            role: 'Lead Engineer',
            company: 'Microsoft',
            startDate: { day: '18', month: 'June', year: '2022' },
            endDate: { day: '29', month: 'August', year: '2022' },
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
            startDate: { day: '18', month: 'January', year: '2019' },
            endDate: { day: '22', month: 'October', year: '2020' },
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
            startDate: { day: '12', month: 'April', year: '2020' },
            endDate: { day: '24', month: 'September', year: '2021' },
            description: 'Lorem ipsum dolor sit amet consectetur. Euismod dignissim lorem condimentum \
            non egestas adipiscing nunc et. Mauris turpis maecenas et proin scelerisque quisque eget.\
             Pharetra a tortor cursus aliquam justo in ante. Vitae libero non fringilla morbi lorem dui\
              mauris morbi accumsan.   Vulputate duis a eu consectetur. Vestibulum morbi fames sem \
              vitae. Lacus non aliquet gravida sed enim id.'
        }
    ],
    knowledge: ['Knowledge 1', 'Knowledge 2', 'Knowledge 3', 'Knowledge 4'],
    languages: ['English', 'Hausa', 'French', 'Chinese'],
    technologies: ['Microsoft Office', 'Linux', 'Adobe Photoshop'],

    performance: [
        {
            name: "Task's Performance",
            value: [
                {
                    label: 'Performance scale',
                    percentage: { daily: '70', weekly: '60', monthly: '100' }
                }
            ]
        },
        {
            name: "Time-bank usage",
            value: [
                {
                    label: 'Time Bank Usage',
                    percentage: { daily: '50', weekly: '40', monthly: '30' }
                }
            ]
        },
        {
            name: "Expenses & invoice",
            value: [
                {
                    label: 'Expense Scale',
                    percentage: { daily: '50', weekly: '40', monthly: '30' }
                },
                {
                    label: 'Invoice Scale',
                    percentage: { daily: '50', weekly: '40', monthly: '30' }
                },
            ]

        },
    ]
}

export default function StaffProfile() {
    const dispatch = useDispatch();

    useEffect(() => {
        /* Set Page title */
        dispatch(setPageTitle({ pageTitle: 'Staff' }))
    }, [])

    const [state, setState] = useState({

    });



    return (
        <Box sx={{
            display: 'block', pb: 1, width: { xs: '100%', md: '95%', lg: '70%', xl: '70%' },
            bgcolor: '#FBFBFB', borderRadius: '16px',
            border: '1px solid rgba(28, 29, 34, 0.1)'
        }}>
            {/* Heading */}
            <Typography sx={{
                width: '100%', wordBreak: 'break-word',
                ml: 1, p: 2, fontSize: { xs: 14, sm: 16 },
                fontWeight: 600, color: 'black'
            }}>
                Qualification
            </Typography>
            <Divider />

            {/* Body */}
            <Paper sx={{ p: 2, m: 1 }}>
                {/* Experience section */}
                <Typography sx={{
                    width: '100%', wordBreak: 'break-word',
                    mb: 1, fontSize: { xs: 14, sm: 16 },
                    fontWeight: 600, color: '#BF0606'
                }}>
                    Experience
                </Typography>
                {/* Work experiences */}
                {profile.workExperience.map(experience =>
                    <Box>
                        {/* Role */}
                        <Typography sx={{ mb: 1, fontSize: { xs: 12, sm: 14 }, fontWeight: 700, color: 'black' }}>
                            {experience.role}
                        </Typography>

                        {/* Company */}
                        <Typography sx={{ mb: 1, fontSize: { xs: 12, sm: 14 }, fontWeight: 600, color: '#333333' }}>
                            {experience.company}
                        </Typography>

                        {/* Date */}
                        <Typography sx={{ mb: 2, fontSize: { xs: 11, sm: 13 }, fontWeight: 600, color: '#8D8D8D' }}>
                            {`${experience.startDate.month?.slice(0, 3)} ${experience.startDate.year}
                                                - ${experience.endDate.month?.slice(0, 3)} ${experience.endDate.year}
                                                `}
                        </Typography>

                        {/* Summary */}
                        <Typography align='justify' sx={{
                            mb: 2, fontSize: { xs: 11, sm: 13 },
                            color: '#333333', fontWeight: 500
                        }}>
                            {experience.description}
                        </Typography>
                    </Box>
                )}
                {!profile.workExperience.length &&
                    <Typography sx={{
                        width: '100%', wordBreak: 'break-word',
                        mb: 2, fontSize: { xs: 11, sm: 15 },
                        fontWeight: 500, color: 'black'
                    }}>
                        No experience
                    </Typography>
                }


                {/* Education Section */}
                <Typography sx={{
                    width: '100%', wordBreak: 'break-word',
                    mb: 1, fontSize: { xs: 14, sm: 16 },
                    fontWeight: 600, color: '#BF0606'
                }}>
                    Education
                </Typography>

                {/* Education records */}
                {profile.education.map(item =>
                    <Box>
                        {/* Course */}
                        <Typography sx={{
                            mb: 1, width: '100%', wordBreak: 'break-word',
                            fontSize: { xs: 12, sm: 14 }, fontWeight: 700, color: 'black'
                        }}>
                            {item.course}
                        </Typography>

                        {/* School */}
                        <Typography sx={{
                            mb: 1, width: '100%', wordBreak: 'break-word',
                            fontSize: { xs: 12, sm: 14 }, fontWeight: 600, color: '#333333'
                        }}>
                            {item.school}
                        </Typography>

                        {/* Date */}
                        <Typography sx={{
                            mb: 2, width: '100%', wordBreak: 'break-word',
                            fontSize: { xs: 11, sm: 13 }, fontWeight: 600, color: '#8D8D8D'
                        }}>
                            {`${item.startDate.month?.slice(0, 3)} ${item.startDate.year}
                                                - ${item.endDate.month?.slice(0, 3)} ${item.endDate.year}
                                                `}
                        </Typography>

                        {/* Summary */}
                        <Typography align='justify' sx={{
                            mb: 2, width: '100%', wordBreak: 'break-word',
                            fontSize: { xs: 11, sm: 13 }, color: '#333333'
                        }}>
                            {item.description}
                        </Typography>
                    </Box>
                )}
                {/* No education record */}
                {!profile.education.length &&
                    <Typography sx={{
                        width: '100%', wordBreak: 'break-word',
                        mb: 2, fontSize: { xs: 11, sm: 15 },
                        fontWeight: 500, color: 'black'
                    }}>
                        No education
                    </Typography>
                }

                {/* Skills, knowledge, languages */}
                <Grid container justifyContent='left'>
                    {/* Tools and technologies */}
                    <Grid item xs={'auto'} sx={{
                        width: '100%',
                        mr: 2, mb: 2, p: 1.5,
                        bgcolor: '#FBFBFB'
                    }}>
                        <Typography sx={{
                            width: '100%', wordBreak: 'break-word',
                            mb: 1, fontSize: { xs: 14, sm: 16 },
                            fontWeight: 600, color: '#BF0606'
                        }}>
                            Tools & Technologies
                        </Typography>
                        {profile.technologies.map(tech =>
                            <Typography sx={{ fontSize: { xs: 12, sm: 14 }, color: '#333333' }}>
                                {tech}
                            </Typography>
                        )}
                        {!profile.technologies.length &&
                            <Typography sx={{
                                width: '100%', wordBreak: 'break-word',
                                mb: 2, fontSize: { xs: 11, sm: 15 },
                                fontWeight: 500, color: 'black'
                            }}>
                                No Tools & Technologies
                            </Typography>
                        }
                    </Grid>

                    {/* Industry knowledge */}
                    <Grid item xs={'auto'} sx={{
                        mr: 2, mb: 2, p: 1.5,
                        bgcolor: '#FBFBFB', width: '100%',
                    }}>
                        <Typography sx={{
                            mb: 1, width: '100%', wordBreak: 'break-word',
                            fontSize: { xs: 14, sm: 16 }, fontWeight: 600, color: '#BF0606'
                        }}>
                            Industry knowledge
                        </Typography>
                        {profile.knowledge.map(item =>
                            <Typography
                                sx={{
                                    width: '100%', wordBreak: 'break-word',
                                    fontSize: { xs: 12, sm: 14 }, color: '#333333'
                                }}>
                                {item}
                            </Typography>
                        )}
                        {!profile.knowledge.length &&
                            <Typography sx={{
                                width: '100%', wordBreak: 'break-word',
                                mb: 2, fontSize: { xs: 11, sm: 15 },
                                fontWeight: 500, color: 'black'
                            }}>
                                No Industry knowledge
                            </Typography>
                        }
                    </Grid>
                    {/* Languages */}

                    <Grid item xs={'auto'} sx={{
                        mr: 2, p: 1.5, width: '100%',
                        bgcolor: '#FBFBFB'
                    }}>
                        <Typography sx={{
                            mb: 1, width: '100%', wordBreak: 'break-word',
                            fontWeight: 600, fontSize: { xs: 14, sm: 16 }, color: '#BF0606'
                        }}>
                            Languages
                        </Typography>
                        {profile.languages.map(language =>
                            <Typography sx={{
                                width: '100%', wordBreak: 'break-word',
                                fontSize: { xs: 12, sm: 14 }, color: '#333333'
                            }}>
                                {language}
                            </Typography>
                        )}
                        {!profile.languages.length &&
                            <Typography sx={{
                                width: '100%', wordBreak: 'break-word',
                                mb: 2, fontSize: { xs: 11, sm: 15 },
                                fontWeight: 500, color: 'black'
                            }}>
                                No languages
                            </Typography>
                        }
                    </Grid>
                </Grid>
            </Paper>
        </Box>


    )
}
