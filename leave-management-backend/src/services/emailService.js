import nodemailer from "nodemailer";
import { generateActionToken } from '../utils/generateToken.js';

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // or your SMTP provider
  port:465,
  secure:true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendLeaveMail = async (leave, user) => {
 const approveToken = generateActionToken(leave.leave_id, 'approved');
const rejectToken = generateActionToken(leave.leave_id, 'rejected');
const messageToken = generateActionToken(leave.leave_id, 'custom_message');

const approveUrl = `${process.env.BASE_URL}/api/leaves/action?token=${approveToken}`;
const rejectUrl = `${process.env.BASE_URL}/api/leaves/action?token=${rejectToken}`;
const messageUrl = `${process.env.FRONTEND_URL}/leave/message?token=${encodeURIComponent(messageToken)}`;


  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.MANAGER_EMAIL,
    subject: `Leave Request from ${user.name}`,
    html: `
      <h3>Leave Request</h3>
      <p><b>Employee:</b> \`${user.name}\`</p>
      <p><b>Reason:</b> \`${leave.reason || "N/A"}\`</p>
      <p><b>Type:</b> \`${leave.type}\`</p>
      <p><b>From:</b> \`${new Date(leave.start_date).toDateString()}\`</p>
      <p><b>To:</b> \`${new Date(leave.end_date).toDateString()}\`</p>
      <br>
      <a href="${approveUrl}" style="padding:10px;background:green;color:white;text-decoration:none;">Approve</a>
      <a href="${rejectUrl}" style="padding:10px;background:red;color:white;text-decoration:none;">Reject</a>
      <a href="${messageUrl}" style="padding:10px;background:blue;color:white;text-decoration:none;">Send Message</a>
    `,
  };
  await transporter.sendMail(mailOptions);
};


export const sendCustomMessageEmail = async (leave, user, message) => {
  const messageToken = generateActionToken(leave.leave_id, 'custom_message');
 const messageUrl = `${process.env.FRONTEND_URL}/leave/message?token=${encodeURIComponent(messageToken)}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,  // employee email
    subject: `Message from HR regarding your leave request`,
    html: `
      <h3>Message from HR</h3>
      <p>${message}</p>
      <p><a href="${messageUrl}" style="padding:10px;background:blue;color:white;text-decoration:none;">View Message</a></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
