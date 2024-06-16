'use client'

import { Box, Button, Typography } from "@mui/material";
import ProspectTable from "./ProspectTable";
import { useState } from "react";
import ClientTable from "./ClientTable";

export default function CRM({ }) {
    const [currentTab, setCurrentTab] = useState('prospect');

    const switchTab = (id) => {
        setCurrentTab(id)
    }

    const tabs = [
        { id: 'prospect', label: 'Prospects', },
        { id: 'client', label: 'Clients', },
    ]

    return <Box sx={{ width: '100%', maxHeight: 'calc(100vh - 80px)', overflow: 'hidden' }}>
        {/* Toolbar */}
        <Box sx={{
            display: 'flex', alignItems: 'center', maxWidth: '100%', py: 1.5, borderBottom: '#1C1D221A',
            bgcolor: currentTab === 'prospect' ? '#F5F5F5' : '#FFF6F6',
        }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, mx: 3 }}>
                CRM/ADDRESS BOOK
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {tabs.map((tab, index) => {
                    return <Button key={index} variant="contained" onClick={() => { switchTab(tab.id) }}
                        sx={{
                            fontSize: 12, fontWeight: 700, px: 2, py: .5, mr: 2, borderRadius: '16px',
                            color: currentTab === tab.id ? 'primary.main' : 'black', ":hover": { color: 'white' },
                            bgcolor: currentTab === tab.id ? '#BF060614' : 'white'
                        }}>
                        {tab.label}
                    </Button>
                })}
            </Box>
        </Box>

        {currentTab === 'prospect' ? <ProspectTable /> : <ClientTable />}
    </Box>
}