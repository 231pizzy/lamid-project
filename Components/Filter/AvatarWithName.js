import generateFileUrl from '@/utils/getImageUrl'
import { Avatar, Box, Typography } from '@mui/material'
import { avatarWithNameStyle } from './style'

export default function AvatarWithName(props) {

    return <Box sx={avatarWithNameStyle.container}>
        <Avatar
            src={generateFileUrl(props?.value?.image)}
            sx={avatarWithNameStyle.avatar}
            css={{}}
        />

        <Typography sx={avatarWithNameStyle.name}>
            {props?.value?.name}
        </Typography>
    </Box>
}