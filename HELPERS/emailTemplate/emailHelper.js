exports.forgotPassword = async (password) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Template</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 50px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            h1 {
                color: #333;
            }
    
            p {
                color: #555;
                line-height: 1.6;
            }
    
            .footer {
                margin-top: 20px;
                text-align: center;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Password Information</h1>
            <p>Hello ,</p>
            <p>Your password is: <strong>${password}</strong></p>
            <p>Thank you for using our service.</p>
            <div class="footer">
                <p>Best regards,<br>GTTCI</p>
            </div>
        </div>
    </body>
    </html>
    
    `;
};

exports.registrationTemplate = function (username, completedStage, nextStage, nextStageURL) {
  return `<table style="max-width: 600px; margin: 20px auto; padding: 20px; border-collapse: collapse; width: 100%; background-color: #ffffff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <tr>
        <td style="text-align: center;">
            <img src="https://businessachieverawards.in/content/images/item-images/50985/logos/05.png" alt="GTTCI Logo" style="max-width: 100%;">
        </td>
    </tr>
    <tr>
        <td style="padding: 20px; text-align: left; color: #333;">
            <h1 style="color: #1A94D4;">Welcome to the GTTCI !</h1>
            <p>Dear ${username},</p>
            <p>Congratulations! 🎉 You've completed ${completedStage} of our magical registration journey. Get ready for ${nextStage} by clicking the button below:</p>
            <p style="text-align: center; margin-top: 20px;"><a href="${nextStageURL}" style="display: inline-block; padding: 15px 30px; background-color: #1A94D4; color: #ffffff; text-decoration: none; border-radius: 25px; transition: background-color 0.3s ease-in-out;">${nextStage}</a></p><br/>
            <p>In ${nextStage}, you will be prompted to provide additional information to complete the registration process, and if you need assistance, reach out to our support at <a href="mailto:abhishek.bavoria@mscorpres.in">abhishek.bavoria@mscorpres.in</a>.</p><br/>
            <p>Wishing you a magical journey!</p>
            <br>
            <p style="font-style: italic; color: #888888;">Best regards,<br>GTTCI</p>
        </td>
    </tr>
    <tr>
        <td style="border-top: 2px solid #1A94D4; padding-top: 20px; text-align: center;">
            <p style="font-size: 12px; color: #888888;">Copyright © 2023 GLOBAL TRADE & TECHNOLOGY COUNCIL OF INDIA</p>
            <p style="font-size: 12px; color: #888888;">254 Jagriti Enclave, New Delhi, India - 110092</p>
        </td>
    </tr>
</table>`;
};

exports.sentOtpTemplate = function (otp) {
  return `Your OTP is ${otp}`;
};
