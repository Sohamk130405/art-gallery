// api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const connection = await db.getConnection();
        try {
          const [user] = await connection.execute(
            `SELECT * FROM users WHERE email = ?`,
            [credentials.email]
          );
          if (user.length > 0) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user[0].password
            );

            if (isPasswordCorrect) return user[0];
          }
          return null; // Explicitly return null if authorization fails
        } catch (error) {
          throw new Error(error);
        } finally {
          connection.release();
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") return true;
      return false;
    },
    async session({ session, token }) {
      // Fetch user's role from the database and add it to the session
      const connection = await db.getConnection();
      try {
        const [userInfo] = await connection.execute(
          `SELECT role , id FROM users WHERE email = ?`,
          [session.user.email]
        );
        if (userInfo.length > 0) {
          session.user.id = userInfo[0].id;
          session.user.role = userInfo[0].role; // Add role to session.user
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        connection.release();
      }
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
