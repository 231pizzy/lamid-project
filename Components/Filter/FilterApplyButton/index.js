import { Button } from "@mui/material";
import { FilterApplyStyle } from "../style";

export default function FilterApplyButton({ handleSubmit }) {
    return <Button
        variant='contained'
        sx={FilterApplyStyle.button}
        onClick={handleSubmit}
    >
        Show result
    </Button>
}