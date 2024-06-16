export const removeHtml = (value) => {
    return value?.replace(/<(.|\n)*?>/g, '')
}