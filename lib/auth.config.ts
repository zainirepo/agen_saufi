import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const u = user as { role: "CEO" | "ADMIN"; profilePicUrl?: string | null };
        token.role = u.role;
        token.profilePicUrl = u.profilePicUrl ?? null;
        token.sub = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as "CEO" | "ADMIN";
        session.user.profilePicUrl = token.profilePicUrl as string | null | undefined;
      }
      return session;
    },
  },
};
