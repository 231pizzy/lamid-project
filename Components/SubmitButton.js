import { Button, CircularProgress } from "@mui/material"

export const SubmitButton = ({ handleSubmit, isSubmitting, label, variant, disabled, style = {} }) => {
    console.log('is submitting', isSubmitting)
    return <Button variant={variant} disabled={disabled || Boolean(isSubmitting)}
        onClick={handleSubmit}
        sx={{ fontSize: 11, px: 1.5, py: .5, ...style }}>
        {isSubmitting && <CircularProgress size={20} sx={{ mr: 2, color: '#08e8de' }} />} {label}
    </Button>
}