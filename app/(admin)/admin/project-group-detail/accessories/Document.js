import React, { useEffect, useMemo, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import moment from "moment";
import IconElement from "@/Components/IconElement";
import { getAllFilesForChat } from "../helper";

const CsvSvg = '/icons/CsvSvg.svg';
const ExcelSvg = '/icons/ExcelSvg.svg';
const PdfSvg = '/icons/pdfSvg.svg';
const TxtSvg = '/icons/TxtSvg.svg';
const DownloadSvg = '/icons/DownloadSvg.svg';

const extStyling = { width: '70px', height: '70px' };

const icon = (icon) => <IconElement {...{ src: icon, style: extStyling }} />;

const fileExtIcons = {
    'pdf': icon(PdfSvg),
    'txt': icon(TxtSvg),
    'csv': icon(CsvSvg),
    'xlsx': icon(ExcelSvg),
};

const imageExtensions = ['png', 'jpg', 'jpeg', 'webp'];

export function Documents({ closeView, projectId }) {
    const [chatfiles, setFiles] = useState({});
    const [state, setState] = useState({ files: [] });

    const updateState = (newValue) => {
        setState((previousValue) => ({ ...previousValue, ...newValue }));
    };

    useEffect(() => {
        getAllFilesForChat({
            projectId,
            dataProcessor: (result) => {
                if (result) {
                    const fileArray = [];
                    result.forEach(resultData =>
                        resultData.fileDataArray.forEach(fileData => {
                            fileArray.push({
                                _id: resultData._id,
                                dateTime: resultData.dateTime,
                                name: fileData.fileName,
                                extension: fileData.fileExtension,
                            });
                        })
                    );
                    updateState({ files: fileArray });
                }
            },
        });
    }, [projectId]);

    useEffect(() => {
        if (state.files?.length) {
            state.files.forEach(async (item) => {
                getFilePath(item.name);
            });
        }
    }, [state.files]);

    const getFilePath = async (filename) => {
        if (!chatfiles[filename]) {
            try {
                const response = await fetch(`/api/get-file-by-name/?folder=project-chat-files&&filename=${filename}`, { method: 'GET' });
                if (response.ok) {
                    const blob = await response.blob();
                    setFiles((prevFiles) => ({ ...prevFiles, [filename]: URL.createObjectURL(blob) }));
                } else {
                    console.error('Error fetching file:', filename, response.status);
                }
            } catch (error) {
                console.error('Error fetching file:', filename, error);
            }
        }
    };

    const groupByDate = useMemo(() => {
        const formattedObject = {};
        state.files.forEach(itemObject => {
            const date = moment(itemObject.dateTime, 'yyyy-MM-DD h:mma').format('DD/MM/yyyy').toString();
            formattedObject[date] = [...(formattedObject[date] || []), itemObject];
        });
        return formattedObject;
    }, [state.files]);

    return (
        <Box>
            {Object.entries(groupByDate).map(([date, dataArray], index) => (
                <Box key={index}>
                    <Typography sx={{ width: '100%', bgcolor: '#1C1D220F', fontWeight: 600, fontSize: 14, px: 3, py: 1 }}>
                        {date}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', px: 2, py: 1 }}>
                        {dataArray.map((dataObject, index) => (
                            <Box align='center' key={index} sx={{ mb: 2, px: 2 }}>
                                <a href={chatfiles[dataObject.name] || '/images/loading.png'} download={dataObject.name}>
                                    <IconButton sx={{ color: '#5D5D5D', my: 1, p: 0 }}>
                                        <IconElement src={DownloadSvg} />
                                    </IconButton>
                                </a>
                                <Box>
                                    {imageExtensions.includes(dataObject.extension) ? (
                                        <img src={chatfiles[dataObject.name] || '/images/loading.png'} alt='image' style={{ width: '70px', height: '70px' }} />
                                    ) : (
                                        fileExtIcons[dataObject.extension]
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
