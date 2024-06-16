import { Box, IconButton, Modal,} from "@mui/material"
import Close from '@mui/icons-material/Close';

const workPhaseLevels = [
    { id: 1, level: "WORK PHASE", description: "The work phase is the work process broken down into phases in order to accomplish the objective of a project group" },
    { id: 2, level: "GOALS", description: "Goals are the objective that needs to be done to accomplish the work process of the project group." },
    { id: 3, level: "TASK", description: "Tasks are the objectives of the goals that need to be executed by individuals." },
    { id: 4, level: "ASSIGN TASK", description: "pick a task and select the staff you want to assign the task to, you can also assign a single task to more than one staff member " }
];


export function WorkphaseSteps({ open, onClose,}) {


    return <Modal open={open} onClose={onClose}>
        <Box sx={{
            height: '590px', width: "880px", transform: 'translate(-50%,-50%)', bgcolor: 'white', p: 1, borderRadius: '16px',
            position: 'absolute', top: '50%', left: '50%', padding: 2
        }}>
            <Box sx={{ position: 'relative' }}>
                {/* Close button */}
                <div className="flex justify-between items-center mt-4 mb-4">
                <h2 className="ml-4 uppercase" style={{fontWeight: '700', fontSize: "20px", lineHeight: '27.24px', color: "rgba(191, 6, 6,1"}}>Steps on how to create a work phase for a project group</h2>
                    <div>
                <IconButton onClick={onClose} sx={{ color: 'black', right: 0, top: 0, }}>
                    <Close sx={{ fontSize: 25, }} />
                </IconButton>
                    </div>
                </div>
                <div style={{width: '840px', height: "480px", top: "118px", gap: "40px", display: "flex",  flexWrap: 'wrap', justifyContent: 'space-between',}}>
                {workPhaseLevels.map(phase => (
                    <div key={phase.id} style={{width: "400px", height: "220px", borderRadius: "18px", border: "1px solid rgba(28, 29, 34, 0.1)", padding: "10px", backgroundColor: "rgba(251, 251, 251, 1)", }}>

                        <div style={{height: "40px", width: "40px", backgroundColor: "rgba(191, 6, 6, 0.1)", borderRadius: "32px", display: "flex", justifyContent: "center", alignItems: "center"}}> 
                            <h2 style={{color: "rgba(191, 6, 6, 1)", fontWeight: "600", fontSize: "18px", lineHeight: "24.51px"}}>{phase.id}</h2>
                        </div>

                        <div style={{alignContent: "center", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "10px"}}>
                            <h1 style={{color: "rgba(51, 51, 51, 1)", fontWeight: "700", fontSize: "20px", lineHeight: "27.24px"}}>{phase.level}</h1>
                        </div>

                        <div style={{height: "100px", width: "317px",alignContent: "center", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "30px"}}>
                            <p style={{ color: "rgba(141, 141, 141, 1)", font: "500", fontSize: "18px",  lineHeight: "24.51px", textAlign: "center",}}>{phase.description}</p>
                        </div>
                    </div>

                    ))}
                </div>

                
            </Box>
        </Box>
    </Modal>
}
