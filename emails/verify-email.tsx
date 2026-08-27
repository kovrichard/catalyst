import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface MailProps {
  name: string;
  url: string;
}

export default function VerifyEmail({ name, url }: MailProps) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              primary: "#666666", // medium grey
              secondary: "#1a1a1a", // very dark grey - dark mode background
              card: "#2a2a2a", // dark grey - dark mode card
              text: "#e4e4e4", // light grey - dark mode foreground
              muted: "#999999", // medium grey - dark mode muted foreground
              border: "#404040", // medium-dark grey - dark mode border
            },
          },
        },
      }}
    >
      <Html>
        <Head>
          <Font
            fontFamily="Montserrat"
            fallbackFontFamily="Verdana"
            webFont={{
              url: "https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Body className="bg-secondary px-2 py-10 font-sans">
          <Container
            className="mx-auto max-w-[480px] border border-border bg-card p-0"
            style={{ borderRadius: "16px" }}
          >
            <Section className="border-border border-b bg-secondary/50 p-8">
              <Row align="center">
                <Column align="center">
                  <Img
                    src="https://raw.githubusercontent.com/kovrichard/catalyst/refs/heads/main/src/app/icon.svg"
                    alt="Catalyst"
                    width={36}
                    height={36}
                    className="inline-block align-middle"
                  />
                  <Text className="m-0 ml-2 inline-block align-middle font-semibold text-2xl text-white tracking-tight">
                    Catalyst
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="p-8">
              <Heading className="mt-0 mb-4 font-medium text-text text-xl">
                Confirm Your Email Address
              </Heading>
              <Text className="mb-6 text-[15px] text-text leading-7">
                Hi <strong>{name}</strong>,
              </Text>
              <Text className="mb-8 text-[15px] text-text leading-7">
                Welcome to Catalyst. Confirm this address so we know we can reach you
                about your account.
              </Text>

              <Section className="mb-8 text-center">
                <Button
                  href={url}
                  className="block w-auto px-8 py-3 font-semibold text-[15px]"
                  style={{
                    borderRadius: "12px",
                    color: "#ffffff",
                    backgroundColor: "#111111",
                    textDecoration: "none",
                  }}
                >
                  Confirm Email
                </Button>
              </Section>

              <Text className="mb-4 text-[15px] text-text leading-7">
                Confirming also lets you sign in with a social account later using this
                same address.
              </Text>

              <Text className="mb-4 text-[15px] text-text leading-7">
                If you didn't create a Catalyst account, you can safely ignore this email
                and nothing will happen.
              </Text>

              <Hr className="my-8 border-border border-t" />

              <Text className="text-center text-muted text-xs leading-5">
                This link will expire in 24 hours.
                <br />
                <Link
                  href={url}
                  className="text-primary"
                  style={{ textDecoration: "underline", color: "#666666" }}
                >
                  {url}
                </Link>
              </Text>
            </Section>

            <Section className="border-border border-t bg-secondary/30 p-6 text-center">
              <Text className="m-0 text-muted text-xs">
                © {new Date().getFullYear()} Catalyst. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}

VerifyEmail.PreviewProps = {
  name: "John Doe",
  url: "http://localhost:3000/api/auth/verify-email?token=12345",
} as MailProps;
