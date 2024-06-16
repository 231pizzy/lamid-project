export const checkHtmlLength = (value) => {
    return value?.replace(/<(.|\n)*?>/g, '')?.trim()?.length
}