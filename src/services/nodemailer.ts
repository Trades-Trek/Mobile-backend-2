const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars');

export const useNodemailerServices = () => {
    const sendMail = async (mailOptions) => {
        const transporter = await nodemailer.createTransport({
            service: 'SendinBlue', // no need to set host or port etc.
            auth: {
                user: process.env.EMAIL,
                pass: process.env.NODEMAIL_PASS
            }
        });
        transporter.use(
            "compile", hbs({
                viewEngine: {
                    extname: '.handlebars', // handlebars extension
                    layoutsDir: `${path.resolve('./src/email_templates/layouts')}`,
                    defaultLayout: 'template', // name of main template
                },
                viewPath: `${path.resolve('./src/email_templates')}`,
                extName: '.handlebars',
            }));
        return await transporter.sendMail(mailOptions)
    }
    return {sendMail}
}


