import mailClient from '@sendgrid/mail';

mailClient.setApiKey(process.env.SENDGRID_API_KEY!);

export default mailClient;
