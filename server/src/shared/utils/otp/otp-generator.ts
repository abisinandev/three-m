export function generateOtp(): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("OTP: ", otp);
  return otp;
}
