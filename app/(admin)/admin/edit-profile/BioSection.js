import { Avatar, Badge, Box, Button, Divider, MenuItem, Select, Typography, lighten } from "@mui/material"

import Camera from "@mui/icons-material/AddAPhotoOutlined";
import { ProfileAvatar } from "@/Components/ProfileAvatar";
import TextInput from "./TextInput";
import { PhoneInput } from "react-international-phone";


const roleDataLabels = ['Project Group', 'Role'];

const flexStyle = {
    display: 'flex', flexDirection: { xs: 'column', md: 'row' },
    alignItems: 'flex-start', mb: 2, flexWrap: { md: 'wrap', lg: 'nowrap' }
}

export default function BioSection({ image, imageChanged, fullName, email, phone, role, birthday, handleTextInput, setPhoneNumber,
    handleTeam, selectedTeam, listOfTeams, roleData, handleFileSelect, openPasswordModal, projectColor }) {
    const label = ({ label, style }) => {
        return <Typography sx={{
            fontSize: { xs: 12, md: 14, }, fontWeight: 600,
            mb: 1, color: '#8D8D8D', whiteSpace: 'pre-wrap', ...style
        }}>
            {label}
        </Typography>
    }

    return <Box sx={{
        mb: 2, borderRadius: '16px', border: '1px solid rgba(28, 29, 34, 0.1)',
        width: { xs: '100%', md: '40%', }, mx: { xs: 2, md: 1 }
    }}>
        {/* heading */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', }}>
                {/* Profile picture */}
                <Badge
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    overlap='circular' badgeContent={
                        <Avatar component='label' sx={{ height: 30, width: 30, bgcolor: '#BF0606' }}>
                            <Camera sx={{ height: 18, width: 18, color: 'white' }} />
                            <input id='inp' type='file' style={{ display: 'none' }} onChange={handleFileSelect} />
                        </Avatar>
                    }>
                    <ProfileAvatar {...{ diameter: 80, src: image, fullName: fullName }} />

                </Badge>
            </Box>

            {/* name, email and role */}
            <Box>
                {/* Name */}
                <Typography
                    sx={{ mb: 1, fontSize: { xs: 14, md: 18 }, color: 'black', fontWeight: 700 }}>
                    {fullName}
                </Typography>

                {/* Email */}
                <Typography
                    sx={{
                        width: '100%', wordBreak: 'break-word', color: '#8D8D8D', fontWeight: 600,
                        fontSize: { xs: 12, md: 13, lg: 14 }, mb: 1,
                    }}>
                    {email}
                </Typography>

                {/* Role */}
                <Typography sx={{
                    fontSize: { xs: 13, md: 16 }, color: '#BF0606', fontWeight: 700
                }}>
                    {role}
                </Typography>
            </Box>
        </Box>

        <Divider sx={{ mt: 1 }} />

        {/* Body */}
        <Box sx={{ py: 2, px: 1, pr: .5 }}>

            <Box sx={{
                ...flexStyle
            }}>
                {/* Email */}
                <Box sx={{ display: 'block', mr: { md: 3, lg: 4, xl: 6 }, my: 1 }}>
                    {label({ label: 'Email' })}
                    <TextInput {...{
                        type: 'email', id: 'email', value: email,
                        placeholder: 'Eg. sam@gmail.com', onChange: handleTextInput
                    }} />
                </Box>

                {/* Password */}
                <Box sx={{ my: 1 }}>
                    {label({ label: 'Password' })}
                    <Button variant="outlined" onClick={openPasswordModal}
                        sx={{ fontSize: 14 }}>
                        Update password
                    </Button>
                </Box>
            </Box>


            <Box sx={{
                ...flexStyle
            }}>
                <Box sx={{ display: 'block', mr: { md: 3, lg: 4, xl: 6 }, my: 1 }}>
                    {label({ label: 'Full name' })}
                    <TextInput {...{
                        type: 'text', id: 'fullName', value: fullName,
                        placeholder: 'John Cena', onChange: handleTextInput
                    }} />
                </Box>

                {/* Phone number */}
                <Box sx={{ my: 1 }}>
                    {label({ label: 'Phone Number' })}
                    <PhoneInput defaultCountry="ng" style={{ display: 'flex', flexWrap: 'wrap', }}
                        value={phone} onChange={setPhoneNumber} />
                </Box>
            </Box>


            <Divider sx={{ mb: 3, mt: 2 }} />

            <Box sx={{ ...flexStyle }}>
                {/* Date of birth */}
                <Box sx={{ display: 'block', mr: { md: 3, lg: 4, xl: 6 }, my: 1 }}>
                    {label({ label: 'Date of birth' })}
                    <TextInput {...{ type: 'date', id: 'birthday', value: birthday, onChange: handleTextInput }} />
                </Box>

                {/* Team */}
                <Box sx={{ display: 'block', my: 1 }}>
                    {label({ label: 'Team' })}
                    <Select sx={{ bgcolor: '#CCCCCC', fontSize: 14 }} id='team' size='small' value={selectedTeam}
                        onChange={handleTeam} >
                        {listOfTeams.map((team, indx) =>
                            <MenuItem key={indx} value={team} sx={{
                                fontSize: { xs: 12, md: 14, xl: 14 },
                                fontWeight: 500, color: '#333333',
                            }}>
                                {team}
                            </MenuItem>)}
                    </Select>
                </Box>
            </Box>

            <Box sx={{ ...flexStyle, alignItems: 'stretch' }}>
                {/* Role */}
                <Box sx={{ display: 'block', mr: { md: 3, lg: 4, xl: 6 }, my: 1 }}>
                    {label({ label: 'Role' })}
                    <TextInput {...{ type: 'text', id: 'role', value: role, placeholder: 'Eg. C.E.O', onChange: handleTextInput }} />
                </Box>

                {/* Project group info */}
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', my: 1 }}>
                    {roleData.map((data, indx) =>
                        <Box sx={{
                            display: 'flex', alignItems: 'center',
                        }}  >
                            {/* Label */}
                            {label({ label: `${roleDataLabels[indx]}: ` })}

                            {/* Avatar */}
                            <ProfileAvatar {...{
                                diameter: 20, fullName: data,
                                styleProp: {
                                    bgcolor: lighten(projectColor || '#8D8D8D', 0.9),
                                    color: projectColor, fontSize: 10, letterSpacing: 0
                                }
                            }} />

                            {/* Value */}
                            {label({ label: data, style: { color: 'black' } })}

                        </Box>)}
                </Box>
            </Box>
        </Box>
    </Box>
}