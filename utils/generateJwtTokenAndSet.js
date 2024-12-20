import jwt from "jsonwebtoken";

const generateVerificationToken = (res, userId) => {
  try {
    // Ensure the secret is defined
    if (!process.env.SECRETE_ID) {
      throw new Error("Missing SECRET_ID environment variable.");
    }

    // Generate the JWT token
    const token = jwt.sign({ userId }, process.env.SECRETE_ID, { expiresIn: "1h" });

    // Set the token in a secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // Cookie expiration (1 hour)
    });

    // Return the token for optional use by the caller
    return token;
  } catch (error) {
    console.error("Error generating verification token:", error.message);
    // Re-throw the error to let the caller handle it
    throw new Error("Token generation failed.");
  }
};

export default generateVerificationToken;
