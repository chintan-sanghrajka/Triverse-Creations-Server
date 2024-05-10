import nodemailer from "nodemailer";

export const sendUserVerificationEmail = async (email: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: "noreply-triversecreations@gmail.com",
        pass: "ooprtbdcwsmrcpeu",
      },
    });
    let info = await transporter.sendMail({
      from: "Triverse Creations",
      to: email,
      subject: "User Verification.",
      html: `
          <div>
          <h2>Dear Chintan,</h2>
            <div style="padding-left: 20px">
            <p  style="font-size: 18px">Your Tickets for has been cancelled successfully.</p>
            <p style="font-size: 18px">Tickets Cancelled:</p>
            <p style="font-size: 18px">Amount to be refunded:</p>
            </div>
            <p style="font-size: 18px">Amout will be refunded in your account within next 5 working days.</p>
          <h2>Thanks and Regards,</h2>
          <h2>Team BookMySeat</h2>
          </div>
          `,
    });
  } catch (error: any) {}
};

export const forgotPasswordEmail = async (email: string) => {};

export const sendOTPEmail = async (email: string) => {};

//email - noreply-triversecreations@gmail.com
//password - NoReplyTC@17102001
//password - oopr tbdc wsmr cpeu
