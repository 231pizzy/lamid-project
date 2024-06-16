export const generateFileUpload = (files) => {
    const uploadedFiles = {};
    files?.forEach(i => {
        uploadedFiles[i?.filename] = i?.file;
    })

    return { ...uploadedFiles, uploadedFileIds: JSON.stringify(Object.keys(uploadedFiles)) }
}