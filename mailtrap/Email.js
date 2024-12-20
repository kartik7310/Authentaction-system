// import { MailtrapClient} from "mailtrap"
import {  transporter } from "./mailtrapConfig.js";
import { validateEmail } from "./validateEmail.js";
export const sendVerificationEmail = async (email, verificationToken) => {
  if (!email || !verificationToken) {
    throw new Error("email and verificationToken not provide");
  }
  validateEmail(email);
  const recipients = [email];
  try {
    const response = await transporter.sendMail({
      from: "kartiklathiyan455@gmail.com",
      to: recipients,
      subject: "verificationToken",
      text: "you have to signup to our website",
      html: `<p>your verificationToken${verificationToken}</p>`,
      category: "your verificationToken",
    });
    console.log("email response", response);
  } catch (error) {
    throw Error(error.message);
  }
};
