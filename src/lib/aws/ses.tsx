import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { render } from "@react-email/components";
import ResetPassword from "@/../emails/reset-password";

import conf from "@/lib/config";
import { logger } from "@/lib/logger";

let client: SESv2Client | null = null;

if (conf.awsConfigured) {
  client = new SESv2Client({ region: conf.awsRegion });
}

export class EmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class EmailNotConfiguredError extends Error {
  constructor() {
    super("Email client not configured.");
    this.name = this.constructor.name;
  }
}

type SendResetPasswordEmailProps = {
  to: string;
  name: string;
  url: string;
};

export async function sendResetPasswordEmail({
  to,
  name,
  url,
}: SendResetPasswordEmailProps) {
  if (!client) {
    const errorMessage = "Email client not configured.";
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  const body = await render(<ResetPassword name={name} url={url} />);

  const command: SendEmailCommand = new SendEmailCommand({
    FromEmailAddress: conf.fromEmailAddress,
    Destination: {
      ToAddresses: [to],
    },
    Content: {
      Simple: {
        Subject: {
          Data: "Catalyst - Reset your password",
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: body,
          },
        },
      },
    },
  });

  try {
    logger.info("Sending reset password email...");

    const data = await client.send(command);

    return data;
  } catch (error) {
    logger.error(`Failed to send email: ${error}`);
    throw error;
  }
}
