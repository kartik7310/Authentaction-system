import { transporter} from "./mailtrapConfig.js"
import { validateEmail } from "./validateEmail.js"
export const sendWelcomeEmail = async(email,userName)=>{
  if(!email||!userName){
    return "email and userName not provide"
  }
  // Validate the email format
  try {
    validateEmail(email);
  } catch (error) {
    throw new Error(`Email validation failed: ${error.message}`);
  }


  const recipients = [email]
  try {
    const response = await transporter.sendMail({
      from:process.env.USER,
      to: recipients,
      subject: "welcome",
      text: "welcome to our website",
      html: `${userName}<h1>welcome to our website</h1>`,
      category: "welcome",
    });
  console.log(response);
  
  } catch (error) {
    console.error(error.message)
  }
}