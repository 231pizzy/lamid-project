import generateFileUrl from '@/utils/getImageUrl'
import { Avatar } from '@mui/material'

export default function AvatarRenderer(props) {

    return <div style={{
        display: 'flex', alignItems: 'center',
        height: '100%'
    }}>
        {props?.value ? <Avatar
            src={props?.value}
            sx={{ height: '30px', width: '30px' }}
        /> : '---'}
    </div>
}