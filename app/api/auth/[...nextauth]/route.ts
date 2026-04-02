import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

function parseIds(csv: string | undefined) {
  return new Set(
    (csv ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

const adminIds = parseIds(process.env.DISCORD_ADMIN_IDS);

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      authorization: { params: { scope: "identify" } },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, profile }) {
      const id =
        ((profile as any)?.id as string | undefined) ??
        (token.sub as string | undefined);

      if (id) {
        (token as any).discordId = id;
        (token as any).isAdmin = adminIds.has(id);
      }

      return token;
    },
    async session({ session, token }) {
      (session.user as any).discordId = (token as any).discordId;
      (session.user as any).isAdmin = Boolean((token as any).isAdmin);
      return session;
    },
  },
});

export { handler as GET, handler as POST };
