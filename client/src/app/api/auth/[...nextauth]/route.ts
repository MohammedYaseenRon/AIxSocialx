import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const authOptions = {
  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Add your authentication logic here
        // For example, verify credentials against your database
        
        // Placeholder return - replace with actual user data
        return {
          id: "1",
          email: credentials.email,
          name: "User"
        }
      }
    })
  ]
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }