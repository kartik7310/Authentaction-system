import {transporter} from "./mailtrapConfig.js"
import {validateEmail} from "./validateEmail.js"
export const sendSuccessEmail = async(email)=>{
  if(!email){
    return "email  not provide"
  }
    // Validate the email format
    try {
      validateEmail(email);
    } catch (error) {
      throw new Error(`Email validation failed: ${error.message}`);
    }
  
  const recipients = [email]
  try {
    const response =await transporter.sendMail({
      from:process.env.USER,
      to: recipients,
      subject: "successFully reset password",
      html: `<h1>you password reset successfully</h1>`,
      category: "success password reset",
    });
  console.log(response);
  
  } catch (error) {
    console.error(error.message)
  }
}