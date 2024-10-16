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

          const passwordHash = await hashPassword(credentials.password as string);

          const newUser = await saveUser({
            name: credentials.name as string,
            email: credentials.email as string,
            password: passwordHash,
            picture: "",
          });

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
        await saveUser({
          name: name,
          email: email,
          picture: picture || "",
        });
      }

      return true;
    },
  },
});

const saltRounds = 10;

async function hashPassword(plainPassword: string) {
  const bcrypt = require("bcrypt");

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
  } catch (error) {
    console.error(error);
  }
}

async function verifyPassword(plainPassword: string, hashedPassword: string) {
  const bcrypt = require("bcrypt");

  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (error) {
    console.error(error);
  }
}
