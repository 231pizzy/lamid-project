
import { createTransport } from 'nodemailer'

export default function sendEmail({ toEmail, fromHeading, attachmentArray, subject, text, html, }) {
    const payload = {
        from: fromHeading,
        to: toEmail,
        subject: subject,
        text: text,
        html: html,
        attachments: attachmentArray
    };

    console.log('payload', payload);

    const setting = {
        service: 'gmail',
        //host: 'brilloconnetz.com',
        //port: 465,
        //secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    };

    console.log('email payload', payload);

    let transporter = createTransport(setting);

    return new Promise((resolve, reject) => {
        console.log('sending...');

        transporter.sendMail(payload, (err, result) => {
            if (err) {
                console.log('mailing err', err);
                resolve(false)
                //  return res.send({ error: 'failed', errMsg: 'email-error' });
            }
            else {
                resolve(result)
            }
            //  callback(req, res, result);
        })
    })
}