import { RoundCheckSvg } from "@/public/icons/icons";
import { checkHtmlLength } from "@/utils/checkHtml";
import { Box, Button, OutlinedInput, TextField, Typography } from "@mui/material";
import { useField } from "formik"

import dynamic from 'next/dynamic'
import { useState } from "react";
import 'react-quill/dist/quill.snow.css';


const ReactQuillNoSSR = dynamic(() => import('react-quill'), { ssr: false })

export default function TabbedTextArea({ placeholders, plain, formProps, tabs, maxLength, rows, variant = 'outlined', ...props }) {
    const [field, meta, helpers] = useField(props);

    const [length, setLength] = useState(meta?.value?.length ?? 0);
    const [currentTab, setCurrentTab] = useState(tabs[0]?.id)

    const handleChange = (value) => {
        helpers.setValue({ ...field.value, [currentTab]: value })
    }

    const switchTab = (id) => {
        setCurrentTab(id)
    }

    return <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        {/* Tab head */}
        <Box sx={{ display: 'flex', width: '100%' }}>
            {tabs.map((item, index) => {
                return <Button variant={'text'} key={index} sx={{
                    color: item?.color, fontSize: 14, fontWeight: 700, textTransform: 'uppercase', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', width: '100%', py: 1.5,
                    borderBottom: currentTab === item?.id ? `3px solid ${item?.color}` : `1px solid #1C1D221A`
                }} onClick={() => { switchTab(item?.id) }}>
                    {item?.label} {<RoundCheckSvg style={{
                        height: '13px', width: '13px', marginLeft: '12px',
                        color: checkHtmlLength(formProps.values[field.name][item?.id]) ? '#4E944F' : '#9F9C9C'
                    }} />}
                </Button>
            })}
        </Box>

        <Box sx={{ pb: 2, pt: 2, width: '90%', mx: 'auto', }}>
            {tabs.map((item, index) => {
                return item?.id === currentTab && (plain
                    ? <TextField {...field} {...props} key={index} fullWidth variant={variant} multiline rows={rows ?? 4}
                        placeholder={placeholders[currentTab]} sx={{ fontSize: 13, fontWeight: 500, bgcolor: 'white' }}
                        onKeyUp={(e) => { setLength(meta.value?.length) }}
                        inputProps={{ ...(maxLength ? { maxLength } : {}) }}
                    />
                    : <ReactQuillNoSSR theme="snow" key={index} modules={{
                        clipboard: {
                            matchVisual: false
                        }
                    }}
                        {...field} {...props}
                        name={field.name}
                        onBlur={() => { }}
                        value={formProps.values[field.name][item?.id] || ''}
                        placeholder={placeholders[item?.id]}
                        onChange={(value) => handleChange(value?.replace(/<a href="www./g, `<a href="https://www.`))}
                        style={{
                            borderTop: '1px solid black', display: 'flex',
                            flexDirection: 'column-reverse', width: '100%'
                        }}
                    />)
            })}

        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', width: '90%', justifyContent: 'space-between' }}>

            {(formProps.touched[field.name] || {})[currentTab] && (formProps.errors[field.name] || {})[currentTab] ? (
                <Typography style={{ color: 'red', fontSize: 11, marginTop: '4px' }}>{(formProps.errors[field.name] || {})[currentTab]}</Typography>
            ) : null}

            {maxLength && <Typography sx={{
                fontSize: 12, mt: 1, alignSelf: 'flex-end'
            }}>{length}/{maxLength}</Typography>}
        </Box>

    </Box>
}