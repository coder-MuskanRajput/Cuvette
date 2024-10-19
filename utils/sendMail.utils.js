import TemplateModel from '../models/template.model.js';
import { sendMail } from '../service/nodemailer.service.js';
import Handlebars from 'handlebars';


export const sendEmailsSequentially = async (candidates, job, companyName) => {
  try {
    // Fetch the email template from the database
    const template = await TemplateModel.findOne({ name: 'job_notification', type: 'email' });

    // Iterate over candidates one-by-one and send email
    for (const candidate of candidates) {
      
      const compiledTemplate = Handlebars.compile(template.subject);
        const subject = compiledTemplate({ companyName:companyName, jobTitle:job.jobTitle });

      const context = {
        jobTitle:job.title,
        companyName:companyName,
        description:job.description,
        experienceLevel:job.experienceLevel,
        endDate:job.endDate.toDateString()
      }
      

      // Send email and wait for it to complete before sending the next
       await sendMail('job_notification',context,'',companyName, candidate, subject);

      
    }

    console.log('All emails processed successfully.');
  } catch (error) {
    console.error('Error sending emails:', error.message);
  }
};



