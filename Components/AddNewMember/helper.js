import { getRequestHandler, postRequestHandler } from "@/Components/requestHandler";

// export function addNewMember({ teamId, formData, dataProcessor }) {

export function addNewMember({ teamId, formData, dataProcessor }) {
    postRequestHandler({
        route: `/api/add-new-member`,
        body: {
            teamId: teamId,
            formData: JSON.stringify(formData)
        },
        successCallback: response => {
            dataProcessor(response);
        },
        errorCallback: err => {
            console.error('Something went wrong', err);
        }
    });
}
