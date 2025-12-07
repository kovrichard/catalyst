import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { render } from "@react-email/components";
import ResetPassword from "@/../emails/reset-password";

import conf from "@/lib/config";
import { logger } from "@/lib/logger";

let client: SESClient | null = null;

if (conf.awsConfigured) {
  client = new SESClient({ region: conf.awsRegion });
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
  const body = await render(<ResetPassword name={name} url={url} />);

  const command: SendEmailCommand = new SendEmailCommand({
    Source: conf.fromEmailAddress,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: "Catalyst - Reset your password",
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: body,
        },
      },
    },
  });

  try {
    if (!client) {
      const errorMessage = "Email client not configured.";
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    logger.info("Sending reset password email...");

    const data = await client.send(command);

    return data;
  } catch (error) {
    logger.error("Failed to send email:", error);
    throw error;
  }
}
