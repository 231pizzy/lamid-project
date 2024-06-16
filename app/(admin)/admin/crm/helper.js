import { getRequestHandler, postRequestHandler } from "@/Components/requestHandler";

export function getNumberOfContacts({ dataProcessor }) {
    getRequestHandler({
        route: `/api/get-contact/?countItems=true`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function getContactList({ offset, size, dataProcessor }) {
    getRequestHandler({
        route: `/api/get-contact/?offset=${offset}&&size=${size}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function searchForContact({ contactName, dataProcessor }) {
    getRequestHandler({
        route: `/api/get-contact/?contactName=${contactName}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function createContact({ contactObject, dataProcessor }) {
    console.log('contactObject', contactObject)

    const body = { contactObject: JSON.stringify(contactObject) }

    postRequestHandler({
        route: `/api/create-contact`,
        body: body,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function updateContactStatus({ id, status, dataProcessor }) {
    postRequestHandler({
        route: `/api/update-contact-status`,
        body: { id, status },
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function editContact({ clientRecordId, contactObject, dataProcessor }) {

    const body = { contactObject: JSON.stringify(contactObject), clientRecordId: clientRecordId }

    postRequestHandler({
        route: `/api/edit-contact`,
        body: body,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function emailContact({ to, subject, emailBody, dataProcessor }) {
    const formData = new FormData();

    const body = { to: to, subject: subject, emailBody: emailBody, }

    Object.keys(body).forEach(key => formData.append(key, body[key]));

    postRequestHandler({
        route: `/api/email-contact`,
        body: formData,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function getLocation({ type, country, state, dataProcessor }) {
    const query = type === 'state' ? `country=${country}` : `country=${country}&&state=${state}`

    getRequestHandler({
        route: `/api/get-location/?type=${type}&&${query}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor({ type: type, result: result })
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function createFollowUp({ date, time, clientId, contactMode, topic, details, rating, dataProcessor }) {

    const body = {
        date: date, time: time, clientId: clientId, contactMode: contactMode, topic: topic,
        details: details, rating: rating,
    }

    postRequestHandler({
        route: `/api/create-followup`,
        body: body,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function deleteContact({ contactId, dataProcessor }) {

    getRequestHandler({
        route: `/api/delete-contact/?id=${contactId}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function getClientContact({ contactId, dataProcessor }) {

    getRequestHandler({
        route: `/api/get-contact/?id=${contactId}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function getFollowupHistory({ contactId, contactMode, dataProcessor }) {
    getRequestHandler({
        route: `/api/get-followup-history/?id=${contactId}&&contactMode=${contactMode}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function createFollowUpComment({ date, time, followupId, comment, dataProcessor }) {

    const body = {
        date: date, time: time, followupId: followupId, comment: comment,
    }

    postRequestHandler({
        route: `/api/create-followup-comment`,
        body: body,
        successCallback: body => {
            const result = body?.result;
            console.log('result', result);

            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function getFollowupComments({ followupId, dataProcessor }) {
    getRequestHandler({
        route: `/api/get-followup-comments/?followupId=${followupId}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function getNumberOfComments({ followupId, dataProcessor }) {
    getRequestHandler({
        route: `/api/followup-comments-count/?followupId=${followupId}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}