import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

import ENV from '../config.js';


// https://ethereal.email/create
let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: ENV.EMAIL, // generated ethereal user
        pass: ENV.PASSWORD, // generated ethereal password
    }
}

// create a transporter to send the email
let transporter = nodemailer.createTransport(nodeConfig);
// create a mail generator to generate the email
let MailGenerator = new Mailgen({
    theme: "default",
    product : {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})


// send an email to the user with the subject and message provided
export async function sendMail(userEmail, subject, message) {
    try {
        // create the email body
        const emailBody = MailGenerator.generate(message);

        // Generate the email
        const email = {
            from : ENV.EMAIL,
            to: userEmail,
            subject : subject,
            html : emailBody
        }
        // Send the email using the transporter
        transporter.sendMail(email)
            .then(() => console.log("Email sent"))
            .catch(error => console.error(error));
        return Promise.resolve()
    } catch (error) {
        return Promise.reject(error)
    }
}