import { Typography } from "@mui/material";

const StatusRenderer = (props) => {

    const statusData = {
        published: {
            color: '#008000',
            background: '#0080001A',
            label: 'Published'
        },
        unpublished: {
            color: '#FF0000',
            background: '#FF00001A',
            label: 'unpublished'
        },
        saved: {
            color: '#800080',
            background: '#8000801A',
            label: 'Saved'
        },
        review: {
            color: '#FF5C00',
            background: '#FF5C001A',
            label: 'Review'
        },
        active: {
            color: '#05A705',
            background: '#DDFCDD',
            label: 'Active'
        },
        pending: {
            color: '#FFB800',
            background: '#FDF1D0',
            label: 'Pending'
        },
        declined: {
            color: '#FF0000',
            background: '#FFE8E8',
            label: 'Declined'
        },
        public: {
            color: '#9F20B4',
            background: '#FAEDFF',
            label: 'Public'
        },
        private: {
            color: '#A3571E',
            background: '#FFD7B9',
            label: 'Private'
        },
        owner: {
            color: '#364451',
            background: '#FAF7F1',
            label: 'Admin'
        },
        rep: {
            color: '#E76881',
            background: '#E768811A',
            label: 'Group Rep'
        },
        member: {
            color: '#4F92AB',
            background: '#4F92AB1A',
            label: 'Member'
        },
        approved: {
            color: '#008000',
            background: '#0080001A',
            label: 'Approved'
        },
        read: {
            color: '#008000',
            background: '#D7FDD7',
            label: 'Read'
        },
        unread: {
            color: '#FF6B00',
            background: '#FFE6D3',
            label: 'Unread'
        },
        replied: {
            color: '#1DADFF',
            background: '#D7F0FF',
            label: 'Replied'
        },
        'ea-user': {
            color: '#4F92AB',
            background: '#4F92AB33',
            label: 'EA User'
        },
        other: {
            color: '#6F3D17',
            background: '#6F3D1733',
            label: 'Others'
        },
        awarded: {
            color: '#008000',
            background: 'white',
            label: 'Awarded'
        },
        rejected: {
            color: '#FF0000',
            background: 'white',
            label: 'Rejected'
        },
        ineligible: {
            color: '#6F3D17',
            background: '#FFC32633',
            label: 'Not Eligible'
        },
        submitted: {
            color: '#3F80FE',
            background: '#3F80FE33',
            label: 'Submitted'
        },
        eligible: {
            color: '#008000',
            background: '#0080001A',
            label: 'Eligible'
        },
        draft: {
            color: '#ED4066',
            background: '#ED40661A',
            label: 'Draft copy'
        },
        cancelled: {
            color: '#8A2424',
            background: '#F4E5E5',
            label: 'Cancelled'
        },
        deleted: {
            color: '#FF0000',
            background: 'transparent',
            label: 'DELETED'
        }, 'initial review': {
            color: '#FF5C00',
            background: '#FF5C0011',
            label: 'Initial Review'
        }, 'voting': {
            color: '#801BA4',
            background: '#801BA411',
            label: 'Voting'
        }, 'final review': {
            color: '#0F92F1',
            background: '#00800011',
            label: 'Final Review'
        }, 'awarded': {
            color: '#008000',
            background: '#00800011',
            label: 'Awarded'
        }, 'rejected': {
            color: '#D52525',
            background: '#D5252511',
            label: 'Rejected'
        }, 'closed-all': {
            color: '#D52525',
            background: '#D5252526',
            label: 'Closed (All Applicants)'
        }, 'closed-eligible': {
            color: '#801BA4',
            background: '#801BA426',
            label: 'Closed (Eligible Applicants)'
        },
        justConcluded: {
            color: '#800080',
            background: '#F5E5EF',
            label: 'Just Concluded'
        },
        concluded: {
            color: '#0E60BF',
            background: '#0E60BF32',
            label: 'Concluded'
        },
        default: {
            color: '#0E60BF',
            background: '#0E60BF32',
            label: 'Default'
        },
        now: {
            color: '#FF9843',
            background: '#FF984332',
            label: 'Happening Now'
        }
    }

    const cellValue = statusData[props.value];


    return (
        <Typography sx={{
            color: cellValue?.color, width: 'max-content', fontSize: 12, verticalAlign: 'middle'
        }}>
            {cellValue?.label}
        </Typography>
    );
}

export default StatusRenderer