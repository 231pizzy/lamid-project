import { ProfileAvatarGroup } from '@/Components/ProfileAvatarGroup'

export default function AvatarGroupRenderer(props) {

    return <div style={{
        display: 'inline-flex', width: '100%', justifyContent: 'center', alignItems: 'center',
        height: '100%'
    }}>
        {props?.value?.length ? <ProfileAvatarGroup
            emailArray={props?.value} color={'#BF0606'} bgcolor={'#FFF2F2'} diameter={20} max={2}
        /> : '---'}
    </div>
}