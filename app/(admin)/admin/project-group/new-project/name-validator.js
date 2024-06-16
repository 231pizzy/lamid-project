'use client'

import { openSnackbar } from "@/Components/redux/routeSlice";
import { validateName } from "../helper";

export const handleValidateName = ({ value, category, dispatch, errMsg, successCallback }) => {
    validateName({
        value: value, category: category,
        dataProcessor: (result) => {
            if (result[0]) {
                dispatch(openSnackbar({ message: errMsg, severity: 'error' }))
            }
            else {
                successCallback()
            }
        }
    })
}