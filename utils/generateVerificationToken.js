import crypto from "crypto"

export const generateVerificationToken = () => {
  return (crypto.randomInt(10000000, 100000000)).toString(); // 8-digit token
};
