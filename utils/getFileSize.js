export const getFileSize = (sizeInBytes) => {
    const sizeInKB = (Number(sizeInBytes || 0) / 1024).toFixed(2);
    const sizeInMB = (Number(sizeInKB || 0) / 1024).toFixed(2);

    if (sizeInMB > 1) return `${sizeInMB}MB`
    else if (sizeInKB > 1) return `${sizeInKB}KB`
    else return `${sizeInBytes}B`
};