const sampleMessage = `Lorem ipsum dolor sit amet consectetur. Ut elementum commodo pharetra id tortor orci. Arcu morbi tellus condimentum vitae nisl facilisis aliquam in. Risus nulla et orci pellentesque cursus ut nisl tellus. Cras non quisque proin potenti. Purus neque eros tincidunt viverra posuere quam cum. Nibh volutpat phasellus quis nisl leo. Viverra eu sollicitudin dignissim neque varius id id. Ac volutpat integer quam volutpat venenatis auctor amet aliquet. Mi sed curabitur nunc non dui nisl aliquam nunc morbi. Tincidunt et sit eget non tristique. Sit nullam arcu enim est. Nec mi et etiam etiam id. Viverra rhoncus nullam tristique eget morbi non pretium.
Amet tellus at etiam ornare. Integer urna cras sed turpis convallis sagittis. Pellentesque scelerisque in et et. Aliquam cras dui sed non adipiscing in tempor mi. In feugiat rhoncus eu imperdiet neque sagittis dui lectus massa. Lorem ipsum dolor sit amet consectetur. Ut elementum commodo pharetra id tortor orci. Arcu morbi tellus condimentum vitae nisl facilisis aliquam in. Risus nulla et orci pellentesque cursus ut nisl tellus. Cras non quisque proin potenti. Purus neque eros tincidunt viverra posuere quam cum. Nibh volutpat phasellus quis nisl leo. Viverra eu sollicitudin dignissim neque varius id id. Ac volutpat integer quam volutpat venenatis auctor amet aliquet. Mi sed curabitur nunc non dui nisl aliquam nunc morbi. Tincidunt et sit eget non tristique. Sit nullam arcu enim est. Nec mi et etiam etiam id. Viverra rhoncus nullam tristique eget morbi non pretium.
Amet tellus at etiam ornare. Integer urna cras sed turpis convallis sagittis. Pellentesque scelerisque in et et. Aliquam cras dui sed non adipiscing in tempor mi. In feugiat rhoncus eu imperdiet neque sagittis dui lectus massa.Lorem ipsum dolor sit amet consectetur. Ut elementum commodo pharetra id tortor orci. Arcu morbi tellus condimentum vitae nisl facilisis aliquam in. Risus nulla et orci pellentesque cursus ut nisl tellus. Cras non quisque proin potenti. Purus neque eros tincidunt viverra posuere quam cum. Nibh volutpat phasellus quis nisl leo. Viverra eu sollicitudin dignissim neque varius id id. Ac volutpat integer quam volutpat venenatis auctor amet aliquet. Mi sed curabitur nunc non dui nisl aliquam nunc morbi. Tincidunt et sit eget non tristique. Sit nullam arcu enim est. Nec mi et etiam etiam id. Viverra rhoncus nullam tristique eget morbi non pretium.
Amet tellus at etiam ornare. Integer urna cras sed turpis convallis sagittis. Pellentesque scelerisque in et et. Aliquam cras dui sed non adipiscing in tempor mi. In feugiat rhoncus eu imperdiet neque sagittis dui lectus massa.Lorem ipsum dolor sit amet consectetur. Ut elementum commodo pharetra id tortor orci. Arcu morbi tellus condimentum vitae nisl facilisis aliquam in. Risus nulla et orci pellentesque cursus ut nisl tellus. Cras non quisque proin potenti. Purus neque eros tincidunt viverra posuere quam cum. Nibh volutpat phasellus quis nisl leo. Viverra eu sollicitudin dignissim neque varius id id. Ac volutpat integer quam volutpat venenatis auctor amet aliquet. Mi sed curabitur nunc non dui nisl aliquam nunc morbi. Tincidunt et sit eget non tristique. Sit nullam arcu enim est. Nec mi et etiam etiam id. Viverra rhoncus nullam tristique eget morbi non pretium.
Amet tellus at etiam ornare. Integer urna cras sed turpis convallis sagittis. Pellentesque scelerisque in et et. Aliquam cras dui sed non adipiscing in tempor mi. In feugiat rhoncus eu imperdiet neque sagittis dui lectus massa.`

export const sampleData = {
    sentMessages: [
        {
            title: 'Title 1',
            status: 'sent',
            email: 'sds@gmail.com',
            date: '2023/12/29',
            fullName: 'Sam Hill',
            message: sampleMessage,
            attachments: [
                { filename: 'sdsd.jpg', filesize: '300000', fileType: 'image' },
                { filename: 'sdsddfd.pdf', filesize: '30000', fileType: 'document' },
            ]
        },
    ],
    receivedMessages: [
        {
            title: 'Title 2',
            email: 'illdslk@gmail.com',
            status: 'received',
            date: '2023/11/19',
            fullName: 'Willian Davis',
            message: sampleMessage,
            attachments: [
                { filename: 'somevideo.mp4', filesize: '120000', fileType: 'video' },
            ]
        },
        {
            title: 'Title 3',
            email: 'illdsdsslk@gmail.com',
            status: 'received',
            date: '2023/10/19',
            fullName: 'Abel Davis',
            message: sampleMessage,
            attachments: [
                { filename: 'someMusic.mp3', filesize: '1000000', fileType: 'audio' },
            ]
        }
    ],
}