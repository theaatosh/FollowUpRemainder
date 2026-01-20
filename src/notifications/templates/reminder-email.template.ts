export const getReminderEmailTemplate = (notification: {
    title: string;
    message: string;
    clientName?: string;
    followUpId?: string;
    clientId?: string;
    frontendUrl?: string;
}) => {
    // Build the client profile URL
    const viewUrl = notification.frontendUrl ? notification.frontendUrl : '#';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${notification.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; border-radius: 12px 12px 0 0;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td>
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                      🔔 Follow-Up Reminder
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Bell Icon Section -->
          <tr>
            <td align="center" style="padding: 30px 40px 10px;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: inline-block; text-align: center; line-height: 80px;">
                <span style="font-size: 40px;">⏰</span>
              </div>
            </td>
          </tr>
          
          <!-- Title -->
          <tr>
            <td align="center" style="padding: 10px 40px;">
              <h2 style="margin: 0; color: #333333; font-size: 22px; font-weight: 600;">
                ${notification.title}
              </h2>
            </td>
          </tr>
          
          <!-- Message Content -->
          <tr>
            <td style="padding: 20px 40px;">
              <div style="background-color: #f8f9ff; border-left: 4px solid #667eea; padding: 20px; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; color: #555555; font-size: 16px; line-height: 1.6;">
                  ${notification.message}
                </p>
              </div>
            </td>
          </tr>
          
          ${notification.clientName ? `
          <!-- Client Info -->
          <tr>
            <td style="padding: 0 40px 20px;">
              <table role="presentation" style="width: 100%; background-color: #fff8e6; border-radius: 8px; padding: 15px;">
                <tr>
                  <td style="padding: 15px;">
                    <p style="margin: 0; color: #856404; font-size: 14px;">
                      <strong>👤 Client:</strong> ${notification.clientName}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}
          
          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 10px 40px 30px;">
              <a href="${viewUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 30px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                View Client Profile
              </a>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border: none; border-top: 1px solid #e8e8e8; margin: 0;">
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 25px 40px; background-color: #fafbfc; border-radius: 0 0 12px 12px;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 10px; color: #888888; font-size: 13px;">
                      This is an automated reminder from your Follow-Up Reminder App
                    </p>
                    <p style="margin: 0; color: #aaaaaa; font-size: 12px;">
                      © ${new Date().getFullYear()} Follow-Up Reminder. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
