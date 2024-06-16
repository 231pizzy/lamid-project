import { getRequestHandler, postRequestHandler } from "@/Components/requestHandler";


export function updateStaff({ dataObject, email, profilePicture, dataProcessor }) {
    console.log('dataObject', dataObject)

    postRequestHandler({
        route: `/api/update-staff`,
        body: { data: JSON.stringify(dataObject), email: email },
        fileArray: profilePicture ? [{ filename: 'profilePicture', file: profilePicture }] : [],
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function checkPassword({ password, dataProcessor }) {
    postRequestHandler({
        route: `/api/check-password`,
        body: { password: password },
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}