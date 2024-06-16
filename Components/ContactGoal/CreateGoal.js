import { Box, Typography } from "@mui/material";
import { Form, Formik, useFormikContext } from "formik";
import { useRef, useState } from "react";
import * as Yup from 'yup';
import { postRequestHandler } from "../requestHandler";
import FieldSectionHeader from "../FieldSectionHeader";
import FormTextArea from "../TextArea/TextArea";
import SideModal from "../SideModal";
import { SubmitButton } from "../SubmitButton";
import FormTextField from "../TextField/TextField";
import { Flag } from "@mui/icons-material";
import RadioList from "../RadioList/RadioList";

export default function CreateGoal({ id, open, handleClose, goalData, goalId }) {
    const [submitting, setSubmitting] = useState(false);

    const [initialValues, setInitialValues] = useState({
        goalName: goalData?.goalName || '', dueDate: goalData?.dueDate || '', flagAt: goalData?.flagAt || '',
        maxFollowup: goalData?.maxFollowup || '', statusOnComplete: goalData?.statusOnComplete || '', clientId: id,
    })

    const [validationSchema] = useState({
        goalName: Yup.string().required('Goal name is required'),
        dueDate: Yup.string().required('Due date is required'),
        flagAt: Yup.number().required('This field is required'),
        maxFollowup: Yup.string().required('This field is required'),
        statusOnComplete: Yup.string().required('This field is required'),
    })

    // const { submitForm, isSubmitting } = useFormikContext()

    const handleFormSubmit = async (value) => {
        setSubmitting(true)
        await postRequestHandler({
            route: '/api/create-contact-goal',
            body: goalId ? { ...value, goalId } : value,
            successCallback: body => {
                setSubmitting(false)
                window.location.reload()
            },
            errorCallback: err => {
                console.log('something went wrong', err)
                setSubmitting(false)
            }
        })
    }

    const options = [
        { value: 'introductory', label: 'Introductory', color: '#257AFB' },
        { value: 'reinforcement', label: 'Reinforcement', color: '#FF6C4B' },
        { value: 'conversion', label: 'Conversion', color: '#4E944F' },
    ]

    return <Box sx={{ width: '100%' }}>
        <Formik
            initialValues={initialValues}
            validationSchema={() => Yup.object(validationSchema)}
            onSubmit={handleFormSubmit}>
            {(formProps) => {
                return (<Form style={{ width: '100%', marginBottom: '36px' }}>
                    <SideModal open={open} handleClose={handleClose} title={goalId ? 'Edit Goal' : 'Create Goal'}
                        actionArray={[
                            <SubmitButton handleSubmit={formProps.submitForm} variant={'contained'}
                                isSubmitting={submitting} label={goalId ? 'Save' : 'Create'}
                            />
                        ]}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '100%' }}>
                            {/* Goal name */}
                            <FieldSectionHeader label={'Goal Name'} />
                            <Box sx={{ py: 2, width: '90%' }}>
                                <FormTextArea plain={true} placeholder={'Explain the goal in detail here...'} name='goalName' />
                            </Box>

                            {/* Due date */}
                            <FieldSectionHeader label={'Due date'} />
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '90%', py: 2 }}>
                                {/* Date field */}
                                <FormTextField placeholder={'Date'} type='date' name='dueDate' />

                                {/* Other info */}
                                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                                        Flag
                                    </Typography>
                                    <Flag sx={{ color: 'red', mx: 2 }} />
                                    <FormTextField placeholder={'1'} small={true} min={1} type='number' name='flagAt' />
                                    <Typography sx={{ ml: 2, fontSize: 13, fontWeight: 400 }}>
                                        days before due date
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Follow up action */}
                            <FieldSectionHeader label={'Follow up action'} />
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '90%', py: 2 }}>
                                <Typography sx={{ mr: 2, fontSize: 13, fontWeight: 400 }}>
                                    Number of follow up actions
                                </Typography>
                                <FormTextField placeholder={'1'} small={true} min={1} type='number' name='maxFollowup' />
                            </Box>

                            {/* Link goal to status */}
                            <FieldSectionHeader label={'Link goal to status'} />
                            <Box sx={{ width: '90%', py: 2 }}>
                                <RadioList wrap={true}
                                    name='statusOnComplete'
                                    items={options}
                                />
                            </Box>
                        </Box>
                    </SideModal>
                </Form>)
            }}
        </Formik>
    </Box>
}