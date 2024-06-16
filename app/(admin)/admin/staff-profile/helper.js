import { getRequestHandler, postRequestHandler } from "@/Components/requestHandler";

export function getPrivileges({ email, dataProcessor }) {
    getRequestHandler({
        route: `/api/get-staff-privileges/?email=${email}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}
