import { prisma } from "../db/db.js";
import bcrypt from "bcrypt";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { sendVerificationEmail } from "../mailtrap/Email.js";
import { sendWelcomeEmail } from "../mailtrap/welcomeEmail.js";
import {sendResetPasswordEmail}from"../mailtrap/sendResetPasswordEmail.js"

import generateToken from "../utils/generateJwtTokenAndSet.js";
import crypto from "crypto";
export const signup = async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    return res.status(400).json("All fields are required");
  }
  try {
    const isUserExist = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (isUserExist) {
      return res.status(400).json("User is already exist");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const createUser = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashPassword,
        verificationToken,
        verificationTokenExpireAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
    const token = generateToken(res, createUser.id);
    await sendVerificationEmail(createUser.email, createUser.verificationToken);
    const { password: _, verificationToken: __, ...userResponse } = createUser;
    res.status(200).json({
      message: "success",
      data: userResponse,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
export const verifyToken = async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json("please enter you code");
  }
  try {
    const codeVerify = await prisma.user.findFirst({
      where: {
        verificationToken: code,
        verificationTokenExpireAt: {
          gt: new Date(),
        },
      },
    });
    if (!codeVerify) {
      return res.status(400).json("invalid code or expired code");
    }
    const user = await prisma.user.update({
      where: {
        id: codeVerify.id,
      },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpireAt: null,
      },
    });
    const { password: _, ...userData } = user;
    await sendWelcomeEmail(user.email, user.userName);
    return res.status(200).json({
      message: "success",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("provide all crediantials");
  }
  try {
    const userExist = await prisma.user.findUnique({ where: { email } });
    if (!userExist) {
      return res.status(400).json("user not exist first signup");
    }
    const decodePassword = await bcrypt.compare(password,userExist.password);
    if (!decodePassword) {
      return res.status(401).json("Invalid user or password");
    }
    const token = generateToken(res, userExist.id);
    const user = await prisma.user.update({
      where: {
        id: userExist.id,
      },
      data: {
        lastLogin: new Date(),
      },
    });

    const { password: _, ...userData } = user;
    res.status(200).json({
      message: "login successfully",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", " ").status(200).json({
      message: "logout success",
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json("please enter you email");
  }
  try {
    const getEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (!getEmail) {
      return res.status(404).json("Invalid email");
    }
    //generate random string
    const resetPasswordToken = crypto.randomBytes(10).toString("hex");
    const resetPasswordTokenExpireAt = new Date(Date.now() + 1 * 60 * 60 * 1000) //1 hour
    const user = await prisma.user.update({
      where: { email:getEmail.email },
      data: {
        resetPasswordToken,
        resetPasswordTokenExpireAt,
      },
    });
    //send email
    sendResetPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password${resetPasswordToken}`
    );
    console.log(resetPasswordToken);
    
    res.status(200).json("proceed")
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  // Check if token is provided
  if (!token) {
    return res.status(400).json({ message: "Token not provided." });
  }

  // Check if both passwords are provided
  if (!password || !confirmPassword) {
    return res.status(400).json({ message: "Please enter your password and confirm it." });
  }

  // Check if both passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password and Confirm Password do not match." });
  }

  try {
    // Find user by token and check expiration
    const user = await prisma.user.findUnique({
      where: {
        resetPasswordToken: token,
        resetPasswordTokenExpireAt: {
          gt:new Date(),
        },
      },
    });

    // Check if user exists or token is invalid/expired
    if (!user) {
      return res.status(400).json({ message: "Invalid token or expired token." });
    }

    // Hash the new password
    const hashPassword = await bcrypt.hash(password, 10);

    // Update user password and remove reset tokens
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpireAt: null,
      },
    });

    // Send success email
    await sendSuccessEmail(user.email);

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
