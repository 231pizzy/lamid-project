import { useRouter } from 'next/router'
import { useState } from 'react';
import Modal from '../FreeModal';
import WarningModal from '../WarningModal';
import useForm from '../Form/hook';



const SingleActionRenderer = (props) => {
    const router = useRouter()
    const form = useForm();
    const [showWarning, setShowWarning] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageTitle, setMessageTitle] = useState(null);


    const { actionEndpoint, title } = props.colDef.cellRendererParams

    const actionData = {
        'resend': {
            color: '#6F3D17', background: '#F9E6D7', borderColor: 'white', label: 'Resend Request',
            message: `You are about to resend a request for report from "${props?.data?.name?.label}" on the fund awarded to them`,
            title: 'Resend Request', endPoint: '/api/cms/funds/internal-funds/report/request'
        },
        'request': {
            color: '#6F3D17', background: 'white', borderColor: '#F9E6D7', label: 'request Report',
            message: `You are about to request a report from "${props?.data?.name?.label}" on the fund awarded to them`,
            title: 'Request Report', endPoint: '/api/cms/funds/internal-funds/report/request'
        }
    }


    const openWarning = () => {
        setMessage(actionData[props?.value]?.message);
        setMessageTitle(actionData[props?.value]?.title);
        setShowWarning(true);
    }

    const closeModal = () => {
        setShowWarning(false)

        setTimeout(() => {
            setMessage(null);
            setMessageTitle(null)
        }, 1000)
    }

    const performAction = async () => {
        console.log('props in report', props?.data)
        form.submit(`${actionData[props?.value]?.endPoint}?id=${props.data.id}`).then(
            async data => {
                //  const { data } = await response.json();
                if (data) {
                    console.log('done ');
                    closeModal();
                    router.reload()
                }
                else {
                    console.log('error sending single action ');
                    closeModal();
                }
            },
            err => {
                console.log('error occured', err);
                closeModal();
            }
        )

    }


    return (
        <div>
            <span style={{
                background: actionData[props?.value]?.background,
                color: actionData[props?.value]?.color, cursor: 'pointer', fontWeight: 700,
                padding: '4px 4px', verticalAlign: 'middle', textTransform: 'uppercase',
                width: 'max-content', border: `1px solid ${actionData[props?.value]?.borderColor}`,
                padding: '4px 10px', fontSize: '12px', borderRadius: '12px', verticalAlign: 'middle'
            }} onClick={openWarning}>
                {actionData[props?.value]?.label}


            </span>
            {showWarning && <Modal visibility={showWarning} handleClose={closeModal}>
                <WarningModal
                    title={`${messageTitle}`}
                    message={`${message}`}
                    status={form.status}
                    proceedAction={async () => { await performAction() }} cancelAction={closeModal}
                />
            </Modal>}
        </div>

    );
}

export default SingleActionRenderer