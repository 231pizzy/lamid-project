export default function downloadFile({ bufferArray, filename, contentType }) {
    console.log('data for download', { bufferArray, contentType });

    const blob = new Blob([new Uint8Array(bufferArray)], { type: /* 'application/octet-stream' */ contentType });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url)
}