import { MailtrapClient } from 'mailtrap';

const TOKEN = 'c32b6f52401265c0a0c2659fe716a29b';
const SENDER_EMAIL = 'hello@demomailtrap.com';
const RECIPIENT_EMAIL = 'dahmakanpromo@gmail.com';

if(!TOKEN) {
  throw new Error('Please provide a valid token');
}

const client = new MailtrapClient({token: TOKEN});

const sender = { name: 'Mailtrap Test', email: SENDER_EMAIL };

client.send({
    from: sender,
    to: [{email: RECIPIENT_EMAIL}],
    subject: 'Hello from Mailtrap',
    text: 'Welcome to Postify AI!'
})
.then(() => {
    console.log('Email sent successfully');
})
.catch((error) => {
    console.error('Error sending email:', error);
});
