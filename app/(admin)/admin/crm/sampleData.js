export const progressData = (state) => [
    {
        createdBy: 'John', goalId: 1,
        goalName: 'Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.',
        dueDate: '2023/12/20',
        flagAt: 2,
        maxFollowup: 5,
        followupUsed: 0,
        followupData: [],
        statusOnComplete: 'reinforcement',
        progessStatus: 'todo',
    },
    {
        createdBy: 'John', goalId: 2,
        goalName: 'Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.',
        dueDate: '2023/12/20',
        flagAt: 2,
        maxFollowup: 5,
        followupUsed: 3,
        followupData: [
            {
                handlerReport: {
                    fullName: 'Sam Don',
                    email: null,
                    date: '2023/12/01',
                    time: '14:20',
                    contactMode: ['phone', 'email'],
                    questionAndAnswers: [
                        { question: `Did you clearly understand and define the ${state.clientRecord.stage}'s need`, answer: 'yes' },
                        { question: `Did you offer the ${state.clientRecord.stage} the appropriate business solutions`, answer: 'yes' },
                        { question: `Did you identify other needs and point the ${state.clientRecord.stage} to the right company solutions`, answer: 'yes' },
                        { question: `Can the company meet the goals set by John`, answer: 'yes' },
                        { question: `Are the needs identified consistent and realistic with the goals set`, answer: 'yes' },
                        { question: `Was the company's actions timely`, answer: 'yes' },
                    ],
                    appetiteRanking: '3/4',
                    outcome: {
                        todo: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`,
                        review: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`,
                        complete: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`
                    },
                    nextStep: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`
                },
                supervisorReport: {
                    fullName: 'John',
                    email: null,
                    questionAndAnswers: [
                        { question: `Did Sam Don clearly understand and define the ${state.clientRecord.stage}'s need`, answer: 'yes' },
                        { question: `Did Sam Don offer the ${state.clientRecord.stage} the appropriate business solutions`, answer: 'yes' },
                        { question: `Did Sam Don identify other needs and point the ${state.clientRecord.stage} to the right company solutions`, answer: 'yes' },
                        { question: `Does the ${state.clientRecord.stage} feel comfortable & confident working with Sam Don`, answer: 'yes' },
                        { question: `Can the company meet the goals set by Sam Don`, answer: 'yes' },
                        { question: `Are the needs identified consistent and realistic with the goals set`, answer: 'yes' },
                        { question: `Was the company's actions timely`, answer: 'yes' },
                    ],
                    appetiteRanking: '3/4',
                    handlerPerformance: '1/4',
                    callToActions: {
                        todo: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`,
                        review: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`,
                        complete: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`
                    },
                    nextStep: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`
                },
            }
        ],
        statusOnComplete: 'reinforcement',
        progessStatus: 'inProgress',
    },
    {
        createdBy: 'John', goalId: 3,
        goalName: 'Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.',
        dueDate: '2023/12/20',
        flagAt: 2,
        maxFollowup: 5,
        followupUsed: 4,
        followupData: [
            {
                handlerReport: {
                    fullName: 'Sam Don',
                    email: null,
                    date: '2023/12/01',
                    time: '14:20',
                    contactMode: ['phone', 'email'],
                    questionAndAnswers: [
                        { question: `Did you clearly understand and define the ${state.clientRecord.stage}'s need`, answer: 'yes' },
                        { question: `Did you offer the ${state.clientRecord.stage} the appropriate business solutions`, answer: 'yes' },
                        { question: `Did you identify other needs and point the ${state.clientRecord.stage} to the right company solutions`, answer: 'yes' },
                        { question: `Can the company meet the goals set by John`, answer: 'yes' },
                        { question: `Are the needs identified consistent and realistic with the goals set`, answer: 'yes' },
                        { question: `Was the company's actions timely`, answer: 'yes' },
                    ],
                    appetiteRanking: '3/4',
                    outcome: {
                        todo: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`,
                        review: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`,
                        complete: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`
                    },
                    nextStep: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`
                },
                supervisorReport: {
                    fullName: 'John',
                    email: null,
                    questionAndAnswers: [
                        { question: `Did Sam Don clearly understand and define the ${state.clientRecord.stage}'s need`, answer: 'yes' },
                        { question: `Did Sam Don offer the ${state.clientRecord.stage} the appropriate business solutions`, answer: 'yes' },
                        { question: `Did Sam Don identify other needs and point the ${state.clientRecord.stage} to the right company solutions`, answer: 'yes' },
                        { question: `Does the ${state.clientRecord.stage} feel comfortable & confident working with Sam Don`, answer: 'yes' },
                        { question: `Can the company meet the goals set by Sam Don`, answer: 'yes' },
                        { question: `Are the needs identified consistent and realistic with the goals set`, answer: 'yes' },
                        { question: `Was the company's actions timely`, answer: 'yes' },
                    ],
                    appetiteRanking: '3/4',
                    handlerPerformance: '1/4',
                    callToActions: {
                        todo: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`,
                        review: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`,
                        complete: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`
                    },
                    nextStep: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`
                },
            }
        ],
        statusOnComplete: 'reinforcement',
        progessStatus: 'completed',
    },
    {
        createdBy: 'John', goalId: 4,
        goalName: 'Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.',
        dueDate: '2023/12/20',
        flagAt: 2,
        maxFollowup: 5,
        followupUsed: 0,
        statusOnComplete: 'reinforcement',
        progessStatus: 'todo',
    },
    {
        createdBy: 'John', goalId: 5,
        goalName: 'Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.',
        dueDate: '2023/12/20',
        flagAt: 2,
        maxFollowup: 5,
        followupUsed: 3,
        followupData: [
            {
                handlerReport: {
                    fullName: 'Sam Don',
                    email: null,
                    date: '2023/12/01',
                    time: '14:20',
                    contactMode: ['phone', 'email'],
                    questionAndAnswers: [
                        { question: `Did you clearly understand and define the ${state.clientRecord.stage}'s need`, answer: 'yes' },
                        { question: `Did you offer the ${state.clientRecord.stage} the appropriate business solutions`, answer: 'yes' },
                        { question: `Did you identify other needs and point the ${state.clientRecord.stage} to the right company solutions`, answer: 'yes' },
                        { question: `Can the company meet the goals set by John`, answer: 'yes' },
                        { question: `Are the needs identified consistent and realistic with the goals set`, answer: 'yes' },
                        { question: `Was the company's actions timely`, answer: 'yes' },
                    ],
                    appetiteRanking: '3/4',
                    outcome: {
                        todo: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`,
                        review: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`,
                        complete: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`
                    },
                    nextStep: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`
                },
                supervisorReport: {
                    fullName: 'John',
                    email: null,
                    questionAndAnswers: [
                        { question: `Did Sam Don clearly understand and define the ${state.clientRecord.stage}'s need`, answer: 'yes' },
                        { question: `Did Sam Don offer the ${state.clientRecord.stage} the appropriate business solutions`, answer: 'yes' },
                        { question: `Did Sam Don identify other needs and point the ${state.clientRecord.stage} to the right company solutions`, answer: 'yes' },
                        { question: `Does the ${state.clientRecord.stage} feel comfortable & confident working with Sam Don`, answer: 'yes' },
                        { question: `Can the company meet the goals set by Sam Don`, answer: 'yes' },
                        { question: `Are the needs identified consistent and realistic with the goals set`, answer: 'yes' },
                        { question: `Was the company's actions timely`, answer: 'yes' },
                    ],
                    appetiteRanking: '3/4',
                    handlerPerformance: '1/4',
                    callToActions: {
                        todo: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`,
                        review: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`,
                        complete: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`
                    },
                    nextStep: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`
                },
            }
        ],
        statusOnComplete: 'reinforcement',
        progessStatus: 'inProgress',
    },
    {
        createdBy: 'John', goalId: 6,
        goalName: 'Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.',
        dueDate: '2023/12/20',
        flagAt: 2,
        maxFollowup: 5,
        followupData: [
            {
                handlerReport: {
                    fullName: 'Sam Don',
                    email: null,
                    date: '2023/12/01',
                    time: '14:20',
                    contactMode: ['phone', 'email'],
                    questionAndAnswers: [
                        { question: `Did you clearly understand and define the ${state.clientRecord.stage}'s need`, answer: 'yes' },
                        { question: `Did you offer the ${state.clientRecord.stage} the appropriate business solutions`, answer: 'yes' },
                        { question: `Did you identify other needs and point the ${state.clientRecord.stage} to the right company solutions`, answer: 'yes' },
                        { question: `Can the company meet the goals set by John`, answer: 'yes' },
                        { question: `Are the needs identified consistent and realistic with the goals set`, answer: 'yes' },
                        { question: `Was the company's actions timely`, answer: 'yes' },
                    ],
                    appetiteRanking: '3/4',
                    outcome: {
                        todo: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`,
                        review: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`,
                        complete: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`
                    },
                    nextStep: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`
                },
                supervisorReport: {
                    fullName: 'John',
                    email: null,
                    questionAndAnswers: [
                        { question: `Did Sam Don clearly understand and define the ${state.clientRecord.stage}'s need`, answer: 'yes' },
                        { question: `Did Sam Don offer the ${state.clientRecord.stage} the appropriate business solutions`, answer: 'yes' },
                        { question: `Did Sam Don identify other needs and point the ${state.clientRecord.stage} to the right company solutions`, answer: 'yes' },
                        { question: `Does the ${state.clientRecord.stage} feel comfortable & confident working with Sam Don`, answer: 'yes' },
                        { question: `Can the company meet the goals set by Sam Don`, answer: 'yes' },
                        { question: `Are the needs identified consistent and realistic with the goals set`, answer: 'yes' },
                        { question: `Was the company's actions timely`, answer: 'yes' },
                    ],
                    appetiteRanking: '3/4',
                    handlerPerformance: '1/4',
                    callToActions: {
                        todo: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`,
                        review: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`,
                        complete: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`
                    },
                    nextStep: `Lorem ipsum dolor sit amet consectetur. A adipiscing ultrices vel non. Integer ipsum quam vitae tellus diam bibendum fringilla massa vestibulum. Aenean interdum.`
                },
            }
        ],
        followupUsed: 4,
        statusOnComplete: 'reinforcement',
        progessStatus: 'completed',
    },
]