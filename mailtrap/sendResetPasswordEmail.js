import { transporter } from "./mailtrapConfig.js";
export const sendResetPasswordEmail = async(email,resetUrl)=>{
  // if(!email||!resetPasswordToken){
  //   return "email or resetPasswordToken not provide"
  // }
  const recipients = [email];
  try {
    const response = await transporter.sendMail({
      from: process.env.USER,
      to: recipients,
      subject: "resetPassword",
      html: `<h1>resetPassword : ${resetUrl}</h1>`,
      category:"reset password"

    });
    console.log("email response", response);
  } catch (error) {
    console.log(error.message);
    
  }
}
