import { Box, OutlinedInput, TextField, Typography } from "@mui/material";
import { useField } from "formik"

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from "react";
import 'react-quill/dist/quill.snow.css';


const ReactQuillNoSSR = dynamic(
    async () => {
        const { default: RQ } = await import('react-quill');
        // eslint-disable-next-line react/display-name
        return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
    },
    { ssr: false }
); //dynamic(() => import('react-quill'), { ssr: false })

export default function FormTextArea({ placeholder, plain, maxLength, includeImage, handleFileUpload, rows, variant = 'outlined', ...props }) {
    const [field, meta, helpers] = useField(props);
    const ref = useRef();

    const [length, setLength] = useState(meta?.value?.length ?? 0);
    const [quillRef, setQuillRef] = useState(null)

    const handleChange = (value) => {
        helpers.setValue(value)
    }

    useEffect(() => {
        setQuillRef(ref)
    }, [])

    const handleFile = () => {
        console.log('this', this)
        if (!quillRef.current || !includeImage) return false

        const editor = quillRef.current.getEditor();
        console.log(editor)
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute('multiple', true)
        // input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = () => {
            const file = input.files;
            handleFileUpload(file)
            /*  if (/^image\//.test(file.type)) {
                 console.log(file);
                 const formData = new FormData();
                 formData.append("image", file);
                 const res = await ImageUpload(formData); // upload data into server or aws or cloudinary
                 const url = res?.data?.url;
                 editor.insertEmbed(editor.getSelection(), "image", url);
             } else {
                 ErrorToast('You could only upload images.');
             } */
        };
    }

    const modules = useMemo(() => {
        return {
            clipboard: {
                matchVisual: false
            },
            toolbar: {
                container: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', "strike"],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' },
                    { 'indent': '-1' }, { 'indent': '+1' }],
                    ['image', "link",],
                    // [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }]
                ],
                handlers: {
                    image: handleFile,
                }
            }
        }
    }, [quillRef])

    return <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', }}>

        {plain
            ? <TextField {...field} {...props} fullWidth variant={variant} multiline rows={rows ?? 4}
                placeholder={placeholder} sx={{ fontSize: 13, fontWeight: 500, bgcolor: 'white' }}
                onKeyUp={(e) => { setLength(meta.value?.length) }}
                inputProps={{ ...(maxLength ? { maxLength } : {}) }}
            />
            : <ReactQuillNoSSR theme="snow"
                //ref={quillRef}
                forwardedRef={quillRef}
                modules={modules}

                {...field} {...props}
                name={field.name}
                onBlur={() => { }}
                placeholder={placeholder}
                onChange={(value) => handleChange(value?.replace(/<a href="www./g, `<a href="https://www.`))}
                style={{
                    borderTop: '1px solid black', display: 'flex',
                    flexDirection: 'column-reverse', width: '100%'
                }}
            />}

        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>

            {/* meta.touched &&  */meta.error ? (
                <Typography style={{ color: 'red', fontSize: 11, marginTop: '4px' }}>{meta.error}</Typography>
            ) : null}

            {maxLength && <Typography sx={{
                fontSize: 12, mt: 1, alignSelf: 'flex-end'
            }}>{length}/{maxLength}</Typography>}

        </Box>

    </Box>
}