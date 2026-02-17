import nodemailer from 'nodemailer';

class NotificationService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail', // Используйте нужный вам сервис
            auth: {
                user: process.env.EMAIL_USER, // Ваш email
                pass: process.env.EMAIL_PASS, // Ваш пароль
            },
        });
    }

    public async sendStatusUpdate(email: string, requestId: string, status: string): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Обновление статуса заявки #${requestId}`,
            text: `Статус вашей заявки изменился на: ${status}`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Ошибка при отправке уведомления:', error);
        }
    }
}

export default new NotificationService();