import { getRequestHandler, postRequestHandler } from "@/Components/requestHandler";

export function getProjectGroup({ dataProcessor }) {
    getRequestHandler({
        route: `/api/get-project-groups`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}
