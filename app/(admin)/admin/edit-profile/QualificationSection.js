import { Box, Button, Divider, Grid, OutlinedInput, Typography } from "@mui/material"

import Delete from "@mui/icons-material/CloseOutlined";

import AddIcon from "@mui/icons-material/AddOutlined";

const workExperienceData = [
    { label: 'Role', stateKey: 'role', type: 'text', placeholder: 'Eg. consultant' },
    { label: 'Company Name', stateKey: 'company', type: 'text', placeholder: 'Eg. Lamid consultant' },
    { label: 'Start Date', stateKey: 'startDate', type: 'date', placeholder: 'Eg. 25th Mar 2022' },
    { label: 'End Date', stateKey: 'endDate', type: 'date', placeholder: 'Eg. 25th Mar 2023' },
    { label: 'Job Summary', stateKey: 'description', type: 'text', placeholder: 'Eg. Share experience here', summary: true },
]


const educationData = [
    { label: 'Course', stateKey: 'course', type: 'text', placeholder: 'Eg. Medicine' },
    { label: 'School Name', stateKey: 'school', type: 'text', placeholder: 'Eg. University of Benin' },
    { label: 'Start Date', stateKey: 'startDate', type: 'date', placeholder: 'Eg. 25th Mar 2022' },
    { label: 'End Date', stateKey: 'endDate', type: 'date', placeholder: 'Eg. 25th Mar 2023' },
    { label: 'Summary', stateKey: 'description', type: 'text', placeholder: 'Eg. Share experience here', summary: true },
]

export default function QualificationSection({ workExperience, education, handleAddEducation, workExperienceTextbox,
    handleAddExperience, handleDeleteSkill, togglePanel, hiddenItems, skillsTexbox, handleAddSkill, skills, languages }) {

    const heading = ({ label, style }) => {
        return <Typography sx={{
            display: 'flex', alignItems: 'center',
            fontSize: { xs: 14, sm: 14 },
            fontWeight: 700, color: '#333333', ...style
        }}>
            {label}
        </Typography>
    }

    const addButton = ({ label, onClick, id }) => {
        return <Button id={id} onClick={onClick}
            sx={{ fontSize: { xs: 11, md: 12 } }}>
            <AddIcon sx={{ height: 18, width: 18 }} />
            {label}
        </Button>
    }

    const segmentHeading = ({ id, label, index, deleteId }) => {
        return <Box id={id} onClick={togglePanel}>
            <Box id={id} sx={{
                display: 'flex', alignItems: 'center',
                bgcolor: 'white', py: 1, pl: 2, mb: 2,
                border: '1px solid rgba(28, 29, 34, 0.1)'
            }}>
                <Typography id={id} sx={{
                    display: 'flex', alignItems: 'center',
                    fontSize: { xs: 12, sm: 12 },
                    fontWeight: 700, color: '#333333'
                }}>
                    {label} - {index + 1}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />

                <Delete id={deleteId} onClick={() => { handleDeleteSkill(deleteId, index) }}
                    sx={{ mr: 2, height: 20, width: 20 }} />
            </Box>
        </Box>
    }

    const skillsElement = ({ label, valueArray, id, placeholder }) => {
        return <Box sx={{
            border: '1px solid rgba(28, 29, 34, 0.05)', mr: 2, mb: 2, bgcolor: '#FBFBFB'
        }}>
            <Typography sx={{
                p: 2, fontWeight: 700, mb: 2, fontSize: { xs: 14, sm: 14 }, bgcolor: 'rgba(28, 29, 34, 0.05)',
                color: '#333333'
            }}>
                {label}
            </Typography>

            {valueArray.map((data, index) =>
                <Box sx={{ px: 2 }}>
                    <Typography sx={{
                        display: 'flex', alignItems: 'center',
                        mb: 1, color: '#8D8D8D', fontSize: { xs: 12, sm: 14 },
                    }}>
                        {label} {index + 1}

                        <Box sx={{ flexGrow: 1 }} />

                        <Delete id={id} onClick={() => { handleDeleteSkill(id, index) }}
                            sx={{ ml: 1, height: 20, width: 20 }} />
                    </Typography>

                    {skillsTexbox(id, 'text', placeholder, index)}

                </Box>
            )}

            {/* If the admin has no tool and technology */}
            {!valueArray.length &&
                <Typography sx={{
                    px: 2, maxWidth: '100%', wordBreak: 'break-word', fontSize: { xs: 11, sm: 12 },
                    fontWeight: 500, color: 'black'
                }}>
                    No {label}
                </Typography>
            }

            <Typography sx={{ pb: 1.5, mt: -1, display: 'flex', justifyContent: 'right' }}>
                {addButton({ label: `Add ${label}`, onClick: handleAddSkill, id: id })}
            </Typography>
        </Box>
    }

    return <Box sx={{
        display: 'block', pb: 2, bgcolor: '#FBFBFB', borderRadius: '16px', mx: { xs: 2, md: 1 },
        border: '1px solid rgba(28, 29, 34, 0.1)', width: { xs: '100%', md: '57%' },
    }}>
        {/* Heading */}
        <Typography sx={{
            p: 2, fontSize: { xs: 14, sm: 16 }, fontWeight: 600,
            color: 'black'
        }}>
            Qualification
        </Typography>
        <Divider />

        {/* Body */}

        {/* Experience section */}
        {/* Experience Header */}
        <Box sx={{
            display: 'flex', alignItems: 'center',
            bgcolor: 'rgba(28, 29, 34, 0.05)', py: 1, px: 2
        }}>
            {heading({ label: 'Experience' })}
            <Box sx={{ flexGrow: 1 }} />
            {addButton({ label: 'Add Experience', onClick: handleAddExperience, id: 'workExperience' })}
        </Box>

        {/* Work experiences */}
        <Box sx={{}}>
            {workExperience.map((experience, indx) =>
                <>
                    {segmentHeading({ id: `experience${indx}`, label: 'EXPERIENCE', index: indx, deleteId: 'workExperience' })}

                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {workExperienceData.map((data, inex) =>
                            !hiddenItems.includes(`experience${indx}`) &&
                            workExperienceTextbox(data.label, data.stateKey, data.type, data.placeholder, indx,
                                data?.summary, 'workExperience')
                        )}
                    </Box>

                </>
            )}

            {/* No experience */}
            {!workExperience.length &&
                <Typography sx={{
                    mt: 1, maxWidth: '100%', wordBreak: 'break-word', mb: 2, fontSize: { xs: 11, sm: 13 }, px: 2,
                    fontWeight: 500, color: 'black'
                }}>
                    No experience record
                </Typography>
            }
        </Box>

        {/* Education section */}
        {/* Education Header */}
        <Box sx={{
            display: 'flex', alignItems: 'center',
            bgcolor: 'rgba(28, 29, 34, 0.05)', py: 1, px: 2
        }}>
            {heading({ label: 'Education' })}

            <Box sx={{ flexGrow: 1 }} />
            {addButton({ label: 'Add Education', onClick: handleAddEducation, id: 'education' })}

        </Box>

        {/* Education data*/}
        <Box sx={{}}>
            {education.map((education, indx) =>
                <>
                    {segmentHeading({ id: `education${indx}`, label: 'EDUCATION', index: indx, deleteId: 'education' })}

                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {educationData.map((data, inex) =>
                            !hiddenItems.includes(`education${indx}`) && workExperienceTextbox(data.label, data.stateKey, data.type,
                                data.placeholder, indx, data?.summary, 'education')
                        )}
                    </Box>

                </>
            )}

            {/* No education */}
            {!education.length &&
                <Typography sx={{
                    mt: 1, maxWidth: '100%', wordBreak: 'break-word', mb: 2, fontSize: { xs: 11, sm: 13 }, px: 2,
                    fontWeight: 500, color: 'black'
                }}>
                    No education record
                </Typography>
            }
        </Box>

        {/* Skills, knowledge, languages */}
        <Box sx={{ justifyContent: { xs: 'left', lg: 'space-evenly' }, }} >
            {/* Tools and technologies */}
            {skillsElement({ label: 'Skills', valueArray: skills, id: 'skills', placeholder: 'Eg. Figma' })}
        </Box>

        <Box sx={{ justifyContent: { xs: 'left', lg: 'space-evenly' }, }} >
            {/* Tools and technologies */}
            {skillsElement({ label: 'Languages', valueArray: languages, id: 'languages', placeholder: 'Eg. French' })}
        </Box>

    </Box>
}