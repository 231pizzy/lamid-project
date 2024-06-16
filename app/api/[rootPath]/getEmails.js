import moment from 'moment';

const { ImapFlow } = require('imapflow');
const simpleParser = require('mailparser').simpleParser;

const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }, logger: false
});

const emailMessages = async ({ emailAddress }) => {
    // Wait until client connects and authorizes
    await client.connect();

    const receivedMessages = [];
    const sentMessages = []
    const rawMessage = []

    // Select and lock a mailbox. Throws if mailbox does not exist
    //  console.log('listing', await client.list())

    //Get sent mails
    let sentMsgLock = await client.getMailboxLock('[Gmail]/Sent Mail'); //For sent mail
    //let lock = await client.getMailboxLock('INBOX');

    const formatMapping = {
        image: ['png', 'jpg', 'jpeg', 'gif'],
        audio: ['mp3'],
        video: ['mp4'],
        document: ['pdf', 'docx', 'doc', 'txt', 'ppt', 'pptx'],
    }

    try {
        // fetch latest message source
        // client.mailbox includes information about currently selected mailbox
        // "exists" value is also the largest sequence number available in the mailbox
        // let message = await client.fetchOne(client.mailbox.exists, { source: true });
        // console.log('message source:', message.source.toString());

        // list subjects for all messages
        // uid value is always included in FETCH response, envelope strings are in unicode.

        // rawMessage.push( client.fetch({ to: `isineyiikenna@gmail.com` }))

        for await (let message of client.fetch(emailAddress ? { to: emailAddress } : '1:*', {
            envelope: true, source: true,
        })) {
            const messageData = await simpleParser(message.source)

            message.envelope.to.forEach(async i => {
                sentMessages.push({
                    email: i.address,
                    fullName: i.name,
                    id: message.uid,
                    status: 'sent',
                    date: moment(message.envelope.date).format('yyyy/MM/DD').toString(),
                    title: message.envelope.subject,
                    message: messageData.html,
                    text: messageData.text,
                    attachments: messageData.attachments?.map(i => {
                        const extension = i?.filename?.split('.').pop().toLowerCase()
                        return {
                            filename: i?.filename || 'Unknown',
                            filesize: i?.size,
                            contentType: i?.contentType,
                            fileType: Object.keys(formatMapping).find(it => formatMapping[it]?.includes(extension)) || 'unknown',
                            file: i?.content.toJSON().data
                        }
                    }),
                })
            })

        }
    } finally {
        // Make sure lock is released, otherwise next `getMailboxLock()` never returns
        sentMsgLock.release();
    }

    //Get received mails 
    let receivedMsgLock = await client.getMailboxLock('INBOX');
    try {
        // fetch latest message source
        // client.mailbox includes information about currently selected mailbox
        // "exists" value is also the largest sequence number available in the mailbox
        // let message = await client.fetchOne(client.mailbox.exists, { source: true });
        // console.log('message source:', message.source.toString());

        // list subjects for all messages
        // uid value is always included in FETCH response, envelope strings are in unicode.
        for await (let message of client.fetch(emailAddress ? { from: emailAddress } : '1:*', {
            envelope: true, source: true
        })) {
            const messageData = await simpleParser(message.source)

            message.envelope.from.forEach(async i => {
                receivedMessages.push({
                    email: i.address,
                    fullName: i.name,
                    id: message.uid,
                    status: 'received',
                    date: moment(message.envelope.date).format('yyyy/MM/DD').toString(),
                    title: message.envelope.subject,
                    message: messageData.html,
                    text: messageData.text,
                    attachments: messageData.attachments?.map(i => {
                        const extension = i?.filename?.split('.').pop()
                        return {
                            filename: i?.filename || 'Unknown',
                            filesize: i?.size,
                            contentType: i?.contentType,
                            fileType: Object.keys(formatMapping).find(it => formatMapping[it]?.includes(extension)) || 'unknown',
                            file: i?.content.toJSON().data
                        }
                    }),
                })
            })
        }
    } finally {
        // Make sure lock is released, otherwise next `getMailboxLock()` never returns
        receivedMsgLock.release();
    }

    // log out and close connection
    await client.logout();

    return {
        sentMessages: sentMessages.sort((a, b) => b?.id - a?.id),
        receivedMessages: receivedMessages.sort((a, b) => b?.id - a?.id)
    }
};


export default emailMessages