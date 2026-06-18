import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "CEO" | "ADMIN";
      profilePicUrl?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "CEO" | "ADMIN";
    profilePicUrl?: string | null;
  }
}
