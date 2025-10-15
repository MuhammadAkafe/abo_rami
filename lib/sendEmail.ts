import nodemailer from 'nodemailer';


export const sendEmail = async (email: string, otp: number) => {
    try {
        // Check if email credentials are configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('Email credentials not configured. Skipping email send.');
            // In development, we can return success, but in production this should be an error
            if (process.env.NODE_ENV === 'production') {
                throw new Error('Email service not configured');
            }
            return {
                accepted: [email],
                rejected: [],
            };
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: email,
            subject: 'OTP for User',
            text: `Your OTP is ${otp}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Your OTP Code</h2>
                    <p>Your verification code is:</p>
                    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold;">
                        ${otp}
                    </div>
                    <p>This code will expire in 5 minutes.</p>
                </div>
            `
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
        return result;
    } 
    catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Failed to send email. Please check email configuration.');
    }
}