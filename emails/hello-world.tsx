import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Tailwind,
  Text,
} from "@react-email/components";

interface MailProps {
  name: string;
}

export default function HelloWorld({ name }: MailProps) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              primary: "#000000",
              muted: "#c7c7c7",
            },
          },
        },
      }}
    >
      <Html>
        <Head>
          <Font
            fontFamily="Inter"
            fallbackFontFamily="Arial"
            webFont={{
              url: "https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwYZ8UA3.woff2",
              format: "woff2",
            }}
          />
        </Head>
        <Body className="text-primary bg-primary py-6">
          <Container className="p-6 mx-auto bg-white rounded-lg">
            <Heading className="text-center">Hello from Catalyst!</Heading>
            <Text>
              Hi, <b>{name}!</b>
            </Text>
            <Hr className="my-[16px] border-t-2 border-muted w-[90%]" />
            <Text>If you received this email, it means one of two things:</Text>
            <ul className="text-sm">
              <li>You sent a test email to yourself.</li>
              <li>You just configured SES successfully.</li>
            </ul>
            <Text>
              Either way, congratulations! You're now (almost?) ready to send emails with
              Catalyst.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}

HelloWorld.PreviewProps = {
  name: "John Doe",
} as MailProps;
