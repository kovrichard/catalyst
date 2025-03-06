import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { render } from "@react-email/components";
import HelloWorld from "../../../emails/hello-world";

if (!process.env.AWS_ACCESS_KEY_ID) {
  throw new Error("AWS_ACCESS_KEY_ID is not set.");
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("AWS_SECRET_ACCESS_KEY is not set.");
}

export class EmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

const client = new SESClient({ region: "eu-central-1" });

export async function sendEmail(from: string, to: string, name: string) {
  const body = await render(<HelloWorld name={name} />);

  const command: SendEmailCommand = new SendEmailCommand({
    Source: from,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: "Hello from Catalyst!",
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
    const data = await client.send(command);

    return data;
  } catch (error: any) {
    console.error(error);
    throw new EmailError("Failed to send email.");
  }
}
