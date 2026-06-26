export const otpEmailTemplate = (otp: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email - three M</title>

  <style>
    body,
    table,
    td,
    a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table,
    td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      outline: none;
      text-decoration: none;
      height: auto;
      line-height: 100%;
    }

    body {
      margin: 0;
      padding: 0;
      width: 100%;
      background-color: #f4f4f4;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .header {
      background: #008f30;
      color: #ffffff;
      padding: 25px 30px;
    }

    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .content {
      padding: 40px 35px;
      text-align: center;
      color: #333333;
    }

    .content h2 {
      color: #008f30;
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 26px;
    }

    .content p {
      font-size: 16px;
      line-height: 1.7;
      margin: 0 0 18px;
    }

    .otp-wrapper {
      margin: 30px 0;
    }

    .otp-box {
      display: inline-block;
      background: #e6f7e9;
      border: 2px solid #008f30;
      border-radius: 10px;
      padding: 18px 30px;
    }

    .otp-code {
      margin: 0;
      font-size: 36px;
      font-weight: bold;
      letter-spacing: 10px;
      color: #005a20;
    }

    .security-note {
      margin-top: 30px;
      font-size: 14px;
      color: #555555;
    }

    .footer {
      background: #f9f9f9;
      border-top: 1px solid #e5e5e5;
      padding: 20px;
      text-align: center;
      color: #888888;
      font-size: 12px;
    }

    .footer a {
      color: #008f30;
      text-decoration: none;
    }
  </style>
</head>

<body>
  <div style="background:#f4f4f4;padding:30px 15px;">
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

            <h2>Your Account Verification Code</h2>

            <p>
              To secure your <strong>three M</strong> account, please use the
              <strong>One-Time Password (OTP)</strong> below to complete your
              sign-up verification.
            </p>

            <div class="otp-wrapper">
              <div class="otp-box">
                <p class="otp-code">${otp}</p>
              </div>
            </div>

            <p>
              <strong>Important:</strong>
              This code is valid for
              <span style="color:#cc0000;font-weight:bold;">5 minutes</span>.
            </p>

            <p>
              Enter it on the sign-up screen to complete your verification.
            </p>

            <p class="security-note">
              <strong>Security Tip:</strong>
              We will <strong>never</strong> call, email, or text you asking
              for this OTP. Please keep it confidential and do not share it
              with anyone.
            </p>

          </td>
        </tr>
      </table>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td class="footer">
            &copy; 2025 three M. All rights reserved.
            <br /><br />
            <a href="#">Privacy Policy</a> |
            <a href="#">Support</a>
          </td>
        </tr>
      </table>

    </div>
  </div>
</body>
</html>`;
};