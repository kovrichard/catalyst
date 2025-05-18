import { randomBytes, scryptSync } from "crypto";
import conf from "@/lib/config";
import { getUserByEmail, saveUser } from "@/lib/dao/users";
import NextAuth from "next-auth";
import { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export class InvalidLoginError extends CredentialsSignin {
  code = "invalid_credentials";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      credentials: {
        name: {},
        email: {},
        password: {},
        register: {},
      },
      authorize: async (credentials) => {
        const user = await getUserByEmail(credentials.email as string);

        if (credentials.register) {
          if (user) {
            throw new Error("User already exists");
          }

          const passwordHash = hashPassword(credentials.password as string);

          const newUser = await createNewUser(
            credentials.name as string,
            credentials.email as string,
            "",
            passwordHash
          );

          return newUser as any;
        } else {
          if (!user) {
            throw new Error("Email or password is incorrect");
          }

          const passwordMatch = await verifyPassword(
            credentials.password as string,
            user.password || ""
          );

          if (!passwordMatch) {
            throw new Error("Email or password is incorrect");
          }

          return user as any;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user?.email;
      const name = user?.name;
      const picture = user?.image;

      if (!email || !name) {
        return false;
      }

      const existingUser = await getUserByEmail(email || "");

      if (!existingUser) {
        await createNewUser(name, email, picture || "");
      }

      return true;
    },
    async jwt({ token, trigger }) {
      if (trigger === "signIn") {
        const user = await getUserByEmail(token.email as string);
        token.userId = user?.id;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId as string;

      return session;
    },
  },
});

async function createNewUser(
  name: string,
  email: string,
  picture: string,
  password?: string
) {
  const user = await saveUser({
    name: name,
    email: email,
    password: password,
    picture: picture,
  });

  const stripeConfigured = conf.stripeSecretKey && conf.stripeWebhookSecret;

  if (stripeConfigured) {
    // const customer = await createStripeCustomer(user);
    // await updateUserWithStripeCustomerId(user.id, customer.id);
    // await createStripeTrialSubscription(user.id, customer.id);
  }

  return user;
}

export function hashPassword(plainPassword: string) {
  try {
    const salt = randomBytes(32).toString("hex");
    const hash = scryptSync(plainPassword, salt, 64).toString("hex");
    return `${salt}:${hash}`;
  } catch (error) {
    console.error(error);
  }
}

export async function verifyPassword(plainPassword: string, hashedPassword: string) {
  try {
    const [salt, hash] = hashedPassword.split(":");
    const hashBuffer = Buffer.from(hash, "hex");
    const key = scryptSync(plainPassword, salt, 64);
    return hashBuffer.toString("hex") === key.toString("hex");
  } catch (error) {
    console.error(error);
  }
}
