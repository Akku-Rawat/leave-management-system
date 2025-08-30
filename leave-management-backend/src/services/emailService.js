import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or your SMTP provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendLeaveMail = async (leave, user) => {
  const approveUrl = `${process.env.BASE_URL}/leave/approve/${leave.leave_id}`;
  const rejectUrl = `${process.env.BASE_URL}/leave/reject/${leave.leave_id}`;

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
    `,
  };
  await transporter.sendMail(mailOptions);
};