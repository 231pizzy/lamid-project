import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import NoteSummaryCard from "./NoteSummaryCard";
import { sampleData } from "./sampleData";
import { getRequestHandler } from "../requestHandler";
import { useRouter } from "next/navigation";
import CreateNote from "./CreateNote";

export default function Notes({ clientId, fullName, emailAddress }) {
    const [open, setOpen] = useState(true);
    const [openCreateNote, setOpenCreateNote] = useState(false);
    const [currentTab, setCurrentTab] = useState('sent');
    const [notes, setNotes] = useState(null);

    const router = useRouter()

    useEffect(() => {
        getRequestHandler({
            route: `/api/get-contact-notes/?id=${clientId}`,
            successCallback: body => {
                setNotes(body?.result)
            },
            errorCallback: err => {
                console.log('Something went wrong', err)
                setNotes([])
            }
        })

    }, [])

    const toggleRanking = () => {
        setOpen(!open)
    }

    const switchTab = (id) => {
        setCurrentTab(id)
    }

    const createNote = () => {
        setOpenCreateNote(true)
    }

    const handleCloseCreateNote = () => {
        setOpenCreateNote(false)
    }

    return <Box sx={{
        border: '1px solid #1C1D221A', boxShadow: '0px 6px 12px 0px #4F4F4F14', bgcolor: '#FBFBFB', overflow: 'hidden',
        borderRadius: '16px', width: '100%', mt: 2, height: '100%', display: 'flex', flexDirection: 'column'
    }}>
        {/* Heading */}
        <Box sx={{
            display: 'flex', alignItems: 'center', maxWidth: '100%', borderBottom: '1px solid #1C1D221A',
            pl: 2, pr: 1, py: 1
        }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                NOTES ({(notes?.length || 0)})
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Button variant='text' sx={{ p: .5, mr: 2, fontSize: 11, fontWeight: 600 }}
                onClick={createNote}>
                Add Note
            </Button>

            <Button variant='text' sx={{
                alignSelf: 'center', color: 'black', fontSize: 12, py: .5, px: .2,
            }}
                onClick={toggleRanking}>
                {open ? 'Close' : 'Open'} {open ? <ArrowDropDown /> : <ArrowDropUp />}
            </Button>
        </Box>

        {/* Content */}
        {open && <Box>
            {notes ? <Box sx={{
                display: 'flex', flexDirection: 'column', maxHeight: '300px',
                overflowY: 'hidden', ":hover": { overflowY: 'auto' }
            }}>
                {notes.map((note, index) => {
                    return <NoteSummaryCard key={index} note={note} />
                })}
            </Box> : <Loader />}
        </Box>}

        {openCreateNote && <CreateNote open={openCreateNote} handleClose={handleCloseCreateNote} />}
    </Box>
}