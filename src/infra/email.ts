import nodemailer from "nodemailer";
import { env } from "cloudflare:workers";

function getTransport() {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT ?? 587),
    secure: Number(env.SMTP_PORT ?? 587) === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
}

function getFrom() {
  return env.SMTP_FROM ?? "SVGLogo <hello@svglogo.dev>";
}

export async function sendVerificationEmail(email: string, url: string) {
  await getTransport().sendMail({
    from: getFrom(),
    to: email,
    subject: "Verify your SVGLogo account",
    html: verificationEmailHtml(url),
  });
}

function verificationEmailHtml(url: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#6366f1,#a855f7);border-radius:16px;width:48px;height:48px;text-align:center;vertical-align:middle;">
                    <span style="font-size:24px;line-height:48px;display:block;">✦</span>
                  </td>
                  <td style="padding-left:12px;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px;">SVGLogo</span>
                    <span style="color:#6366f1;font-size:20px;font-weight:700;">.dev</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#141414;border:1px solid #1f1f1f;border-radius:20px;padding:40px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0">

                <!-- Heading -->
                <tr>
                  <td style="padding-bottom:8px;">
                    <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Verify your email</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:32px;">
                    <p style="margin:0;color:#717171;font-size:14px;line-height:1.6;">
                      Click the button below to verify your email address and activate your SVGLogo account.
                    </p>
                  </td>
                </tr>

                <!-- Button -->
                <tr>
                  <td style="padding-bottom:32px;" align="center">
                    <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#a855f7);color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:13px 32px;border-radius:10px;letter-spacing:0.1px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="border-top:1px solid #1f1f1f;padding-top:24px;padding-bottom:16px;">
                    <p style="margin:0;color:#555555;font-size:12px;">Or copy this link into your browser:</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:24px;">
                    <p style="margin:0;color:#6366f1;font-size:12px;word-break:break-all;">${url}</p>
                  </td>
                </tr>

                <!-- Footer note -->
                <tr>
                  <td style="border-top:1px solid #1f1f1f;padding-top:24px;">
                    <p style="margin:0;color:#444444;font-size:12px;line-height:1.6;">
                      If you didn't create an account on SVGLogo.dev, you can safely ignore this email.
                      This link expires in 24 hours.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;color:#333333;font-size:12px;">
                © 2026 SVGLogo.dev — Made with ♥
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
