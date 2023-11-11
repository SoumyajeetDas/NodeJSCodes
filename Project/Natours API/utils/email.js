const nodemailer = require('nodemailer');

const sendEmail = async(options) => {


    // Chack with dedicated email addresses
    // const transporter = nodemailer.createTransport({
    //     service:'Gmail',
    //     auth: {
    //         user: process.env.EMAIL_USERNAME,
    //         pass: process.env.EMAIL_PASSWORD
    //     }
    // });

    // This is checking in MailTrapper
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from : 'Jonas Schmedtmann <hello@jonas.io>',
        to:options.email,
        subject: options.subject,
        text:options.message
    }


    await transporter.sendMail(mailOptions);
}


module.exports = sendEmail;