import { getRequestHandler } from "@/Components/requestHandler";

export function getFrontPageDashboardData({ dataProcessor }) {
    getRequestHandler({
        route: `/api/get-frontpage-dashboard`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}