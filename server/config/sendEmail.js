import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.RESEND_API) {
  throw new Error("Provide RESEND_API in the .env file");
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "grocerEase@resend.dev", // Use Resend's default verified sender or your verified domain
      to: sendTo,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error(error.message || "Failed to send email");
    }

    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error; // Re-throw so caller knows it failed
  }
};

export default sendEmail;
