export const otpEmailTemplate = (otp: string) => {
  return `<!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Verify Your Email - three M</title>
                        <style>
                            /* Base Styling & Reset */
                            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                            img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                            
                            /* General Look */
                            body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
                            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); overflow: hidden; }
                            
                            /* Header */
                            .header { background-color: #008f30; padding: 25px 30px; text-align: left; color: #ffffff; }
                            .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 1px; }
                            
                            /* Content */
                            .content { padding: 40px 40px 30px 40px; text-align: center; color: #333333; }
                            .heading-color { color: #008f30; } /* Main brand green for headings */
                            
                            /* OTP Box - The Key Focus */
                            .otp-box-wrapper { padding: 20px 0; }
                            .otp-box { 
                                background-color: #e6f7e9; /* Light Green Background */
                                border: 1px solid #008f30; 
                                border-radius: 8px; 
                                padding: 20px 25px; 
                                margin: 0 auto; 
                                display: inline-block; 
                                width: fit-content;
                            }
                            .otp-box p { 
                                margin: 0; 
                                font-size: 38px; 
                                font-weight: 700; 
                                letter-spacing: 10px; /* Wider spacing makes it look more official/secure */
                                color: #005a20; /* Darker Green for the number */
                            }

                            /* Footer */
                            .footer { background-color: #f9f9f9; padding: 20px 30px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #e0e0e0; }
                            .footer a { color: #008f30; text-decoration: none; }
                        </style>
                    </head>
                    <body>

                    <div style="background-color: #f4f4f4; padding: 30px 0;">
                        <div class="container">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="header">
                                        <h1>three M</h1>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="content">
                                        <h2 class="heading-color" style="font-size: 24px; margin-top: 0; margin-bottom: 15px;">Your Account Verification Code</h2>
                                        
                                        <p style="font-size: 17px; line-height: 1.6; margin-bottom: 25px;">
                                            To secure your **three M** account, please use the **One-Time Password (OTP)** below to complete your sign-up verification.
                                        </p>

                                        <div class="otp-box-wrapper">
                                            <div class="otp-box">
                                                <p style="mso-text-raise: 5px;">${otp}</p>
                                            </div>
                                        </div>

                                        <p style="font-size: 16px; margin-top: 25px; margin-bottom: 15px;">
                                            **Important:** This code is valid for <span style="color: #cc0000; font-weight: bold;">5 minutes</span>.
                                        </p>

                                        <p style="font-size: 16px; margin-bottom: 0;">
                                            Enter it on the sign-up screen to gain access.
                                        </p>
                                        
                                        <p class="security-note" style="margin-top: 30px;">
                                            <span style="font-weight: bold; color: #333333;">Security Tip:</span> We will **never** call, email, or text you asking for this OTP. Keep it confidential.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="footer">
                                        &copy; 2025 three M. All rights reserved. | <a href="#" style="color: #008f30; text-decoration: none;">Privacy Policy</a> | <a href="#" style="color: #008f30; text-decoration: none;">Support</a>
                                    </td>
                                </tr>
                            </table>

                        </div>
                    </div>

                    </body>
                    </html>`;
};
