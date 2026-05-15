const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

// ✅ CREATE TRANSPORTER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password
  },
});

// ✅ SEND PROFIT EMAIL FUNCTION
const sendAdderEmail = async (email, amount, type) => {
  try {
    const subject = `Transfer ${type} Successful 💰`;

    const mailOptions = {
      from: `ForexPluse <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text: `A ${type} of $${amount} has been added to your account.`,
      html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0; padding:0; background:#0f172a; font-family:Arial;">

        <table width="100%" style="padding:20px;">
          <tr>
            <td align="center">

              <table width="600" style="background:#111827; border-radius:12px; padding:30px; color:#fff;">
                
                <tr>
                  <td align="center">
                    <h1 style="color:#22c55e;">ForexPluse</h1>
                    <p style="color:#9ca3af;">Secure Financial Platform</p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:20px;">
                    <div style="font-size:50px;">💰</div>
                    <h2 style="color:#22c55e;">${type} Added</h2>
                  </td>
                </tr>

                <tr>
                  <td style="background:#0f172a; padding:20px; border-radius:10px;">
                    <p>Hello,</p>
                    <p>Good news! A new profit has been successfully credited to your account.</p>

                    <table width="100%">
                      <tr>
                        <td>Amount:</td>
                        <td align="right"><b>$${amount}</b></td>
                      </tr>
                      <tr>
                        <td>Status:</td>
                        <td align="right" style="color:#22c55e;">Credited</td>
                      </tr>
                      <tr>
                        <td>Date:</td>
                        <td align="right">${new Date().toLocaleString()}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:20px;">
                    <a href="https://primevests.vercel.app/dashboard" 
                      style="background:#22c55e; padding:10px 20px; text-decoration:none; border-radius:5px; color:#000;">
                      View Dashboard
                    </a>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="font-size:12px; color:#6b7280;">
                    Keep growing your earnings with ForexPluse 🚀
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
      </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`📧 Profit email sent to ${email}`);
  } catch (error) {
    console.error("❌ Email error:", error);
  }
};

// ✅ EXPORT
module.exports = { sendAdderEmail };