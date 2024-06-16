import createFileUrl from '../../backend-api/createFileUrl'
import * as UI from '../UI/styles'

export default function ApprovalRenderer(props) {
    //    console.log('props', props);

    //  console.log('value', props?.value, 'id', props?.data?.id)

    return <div style={{
        display: 'flex', alignItems: 'center', maxWidth: '100%',
        height: '100%', justifyContent: 'center'
    }}>
        {props?.value ?
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M17.7658 8.164C18.0781 8.47642 18.0781 8.98296 17.7658 9.29544L11.6971 15.3639C10.7598 16.3012 9.24015 16.3012 8.30294 15.3639L6.23431 13.2954C5.9219 12.983 5.9219 12.4764 6.23431 12.1641C6.54674 11.8516 7.05327 11.8516 7.36569 12.1641L9.43424 14.2326C9.74672 14.545 10.2533 14.545 10.5658 14.2326L16.6342 8.164C16.9467 7.85158 17.4533 7.85158 17.7658 8.164Z" fill="#008000" />
                <rect x="0.75" y="0.75" width="22.5" height="22.5" rx="11.25" stroke="#008000" strokeWidth="1.5" />
            </svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 8L16 16" stroke="#FF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 16L16 8" stroke="#FF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="0.75" y="0.75" width="22.5" height="22.5" rx="11.25" stroke="#FF0000" strokeWidth="1.5" />
            </svg>
        }
    </div>
}