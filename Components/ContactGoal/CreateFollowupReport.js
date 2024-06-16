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
import { Flag, Phone } from "@mui/icons-material";
import RadioList from "../RadioList/RadioList";
import FieldLabel from "../FieldLabel/FieldLabel";
import { FacebookSvg, InPersonSvg, LetterSvg, MailSvg, OnlineSvg, PhoneSvg } from "@/public/icons/icons";
import CheckboxList from "../CheckboxList/CheckboxList";
import Ranking from "../Ranking/Ranking";
import TabbedTextArea from "../TabbedTextArea/TabbedTextArea";

export default function CreateFollowupReport({ id, open, handleClose, goalName, followupId, goalProgress, index, clientStage, followupData, goalId }) {
    const [submitting, setSubmitting] = useState(false);

    const [initialValues, setInitialValues] = useState({
        date: followupData?.date || '', time: followupData?.time || '',
        contactMode: followupData?.contactMode || [],
        questionAndAnswers: followupData?.questionAndAnswers || [
            { question: `Did you clearly understand and define the ${clientStage}'s need`, answer: '' },
            { question: `Did you offer the ${clientStage} the appropriate business solutions`, answer: '' },
            { question: `Did you identify other needs and point the ${clientStage} to the right company solutions`, answer: '' },
            { question: `Can the company meet the goals set by John`, answer: '' },
            { question: `Are the needs identified consistent and realistic with the goals set`, answer: '' },
            { question: `Was the company's actions timely`, answer: '' },
        ],
        nextStep: followupData?.nextStep || '',
        appetiteRanking: followupData?.appetiteRanking || '',
        outcome: followupData?.outcome || {},
        clientId: id, goalId
    })

    const [validationSchema] = useState({
        date: Yup.string().required('Date is required'),
        time: Yup.string().required('Time is required'),
        contactMode: Yup.array().min(1, 'Mode of contact is required').required('Mode of contact is required'),
        nextStep: Yup.string().required('Next step is required'),
        appetiteRanking: Yup.string().required('Appetite ranking is required'),
        questionAndAnswers: Yup.array().of(Yup.object().shape({
            question: Yup.string().required('Question is required'),
            answer: Yup.string().required('Answer is required'),
        })),
        outcome: Yup.object().shape({
            todo: Yup.string(),
            review: Yup.string(),
            complete: Yup.string(),
        })
    })

    const progress = {
        todo: { id: 'todo', color: '#257AFB', label: 'To do' },
        inProgress: { id: 'inProgress', color: '#FF6C4B', label: 'In Progress' },
        completed: { id: 'completed', color: '#4E944F', label: 'Completed' },
    }

    const evaluationOptions = [
        `Did you clearly understand and define the ${clientStage}'s need`,
        `Did you offer the ${clientStage} the appropriate business solutions`,
        `Did you identify other needs and point the ${clientStage} to the right company solutions`,
        `Can the company meet the goals set by John`,
        `Are the needs identified consistent and realistic with the goals set`,
        `Was the company's actions timely`,
    ]

    const yesNoOptions = [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
    ]

    const appetiteRankingOptions = [
        { value: 1, label: 'Poor' },
        { value: 2, label: 'Fair' },
        { value: 3, label: 'Good' },
        { value: 4, label: 'Excellent' },
        { value: 'N/A', label: 'undecided' },
    ]

    const callToActionOptions = [
        { id: 'complete', label: 'Complete', color: '#4E944F' },
        { id: 'review', label: 'Review', color: '#F24DD8' },
        { id: 'todo', label: 'Todo', color: '#F4CD1E' },
    ]

    const handleFormSubmit = async (value) => {
        setSubmitting(true)
        await postRequestHandler({
            route: '/api/create-followup-report',
            body: {
                ...value, contactMode: JSON.stringify(value.contactMode),
                outcome: JSON.stringify(value.outcome),
                questionAndAnswers: JSON.stringify(value.questionAndAnswers),
                ...(followupId ? { followupId } : {})
            },
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

    const iconStyle1 = { height: '20px', width: '20px', marginLeft: '4px' }

    const contactModes = [
        { value: 'phone', label: 'Phone', icon: <PhoneSvg style={iconStyle1} /> },
        { value: 'inPerson', label: 'In Person', icon: <InPersonSvg style={iconStyle1} /> },
        { value: 'email', label: 'Email', icon: <MailSvg style={iconStyle1} /> },
        { value: 'online', label: 'Online', icon: <OnlineSvg style={iconStyle1} /> },
        { value: 'facebook', label: 'Facebook', icon: <FacebookSvg style={iconStyle1} /> },
        { value: 'letter', label: 'Letter', icon: <LetterSvg style={iconStyle1} /> },
    ]

    return <Box sx={{ width: '100%' }}>
        <Formik
            initialValues={initialValues}
            validationSchema={() => Yup.object(validationSchema)}
            onSubmit={handleFormSubmit}>
            {(formProps) => {
                console.log('values in form props', formProps)
                return (<Form style={{ width: '100%', marginBottom: '36px' }}>
                    <SideModal open={open} handleClose={handleClose} title={'Report'}
                        actionArray={[
                            <SubmitButton handleSubmit={formProps.submitForm} variant={'contained'}
                                isSubmitting={submitting} label={'Save'}
                            />
                        ]}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '100%' }}>
                            {/* Goal name */}
                            <FieldSectionHeader label={'Goal information'} collapsable={true} >
                                <Box sx={{ width: '90%', display: 'flex', width: '100%', flexDirection: 'column' }}>
                                    <Box sx={{
                                        display: 'flex', alignItems: 'center', px: 4, py: 1.5,
                                        borderBottom: '1px solid #1C1D221A'
                                    }}>
                                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                                            GOAL - {index + 1}
                                        </Typography>

                                        <Typography sx={{
                                            border: `1px solid ${progress[goalProgress]?.color}`, fontSize: 10,
                                            bgcolor: `${progress[goalProgress]?.color}10`, px: 1, py: .2, ml: 2,
                                            borderRadius: '8px', color: progress[goalProgress]?.color, fontWeight: 600
                                        }}>
                                            {progress[goalProgress]?.label}
                                        </Typography>
                                    </Box>

                                    <Typography sx={{ fontSize: 13, fontWeight: 600, my: 1.5, px: 4 }}>
                                        {goalName}
                                    </Typography>
                                </Box>
                            </FieldSectionHeader>

                            {/* date and time */}
                            <FieldSectionHeader label={'Date & Time'} collapsable={true} >
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '90%', py: 2, ml: 4 }}>
                                    {/* Date field */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', mr: 2 }}>
                                        <FieldLabel label={'Date'} />
                                        <FormTextField placeholder={'Date'} type='date' name='date' />
                                    </Box>

                                    {/* Date field */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <FieldLabel label={'Time'} />
                                        <FormTextField placeholder={'Date'} type='time' name='time' />
                                    </Box>
                                </Box>
                            </FieldSectionHeader>

                            {/* Mode of contact */}
                            <FieldSectionHeader label={'Mode of contact'} collapsable={true} >
                                <Box sx={{ width: '90%', py: 2, ml: 4 }}>
                                    <CheckboxList wrap={true} name='contactMode' items={contactModes} />
                                </Box>
                            </FieldSectionHeader>


                            {/* Handler's evaluation */}
                            <FieldSectionHeader label={"Handler's Evaluation Of Prospect"} collapsable={true} >
                                {evaluationOptions.map((item, index) => {
                                    return <Box sx={{
                                        display: 'flex', flexDirection: 'column', width: '100%', py: 2,
                                        borderBottom: '1px solid #1C1D221A'
                                    }}>
                                        <Box sx={{ width: '90%', ml: 4 }}>
                                            <FieldLabel label={item} />
                                        </Box>

                                        <Box sx={{ width: '90%', ml: 4 }}>
                                            <RadioList wrap={true} bgcolor={'#F8F8F8'}
                                                name={`questionAndAnswers.${index}.answer`}
                                                items={yesNoOptions}
                                            />
                                        </Box>
                                    </Box>
                                })}
                            </FieldSectionHeader>

                            {/* Appetite ranking */}
                            <FieldSectionHeader label={"Prospect Appetite Ranking"} collapsable={true} >
                                <Box sx={{ width: '90%', py: 2, ml: 4 }}>
                                    <Ranking wrap={true}
                                        name={`appetiteRanking`}
                                        items={appetiteRankingOptions}
                                    />
                                </Box>
                            </FieldSectionHeader>

                            {/* Call To Action */}
                            <FieldSectionHeader label={"Call To Action"} collapsable={true} >
                                <Box sx={{ width: '100%', }}>
                                    <TabbedTextArea
                                        placeholders={{ todo: 'To do', review: 'Review', complete: 'Completed' }}
                                        formProps={formProps}
                                        tabs={callToActionOptions}
                                        name='outcome'
                                    />
                                </Box>
                            </FieldSectionHeader>

                            {/* Next step */}
                            <FieldSectionHeader label={"Next Step"} collapsable={true} >
                                <Box sx={{ width: '90%', py: 2, ml: 4, }}>
                                    <FormTextArea placeholder={'Next step of action...'} name='nextStep' />
                                </Box>
                            </FieldSectionHeader>
                        </Box>
                    </SideModal>
                </Form>)
            }}
        </Formik>
    </Box>
}