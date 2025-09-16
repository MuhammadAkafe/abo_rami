import { prisma } from "@/app/(lib)/prisma"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    console.log('Missing credentials')
                    return null
                }
                
                try {
                    console.log('Attempting to find user with email:', credentials.email)
                    const user = await prisma.users.findUnique({
                        where: { email: credentials.email },
                    })
                    
                    if (!user) {
                        console.log('User not found:', credentials.email)
                        return null
                    }
                    
                    console.log('User found:', user.email, 'Role:', user.role)
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
                    
                    if (!isPasswordValid) {
                        console.log('Invalid password for user:', credentials.email)
                        return null
                    }
                    
                    console.log('Authentication successful for user:', credentials.email)
                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: `${user.firstName} ${user.lastName}`,
                        role: user.role,
                    }
                } catch (error) {
                    console.error('Authentication error:', error)
                    return null
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user && 'role' in user) {
                token.role = user.role
                token.id = user.id
            }   
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as { id: string; role: string }).id = token.id as string
                (session.user as { id: string; role: string }).role = token.role as string
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
    pages: {
        signIn: '/Login',
        signOut: '/Login',
    },
    session: {
        strategy: 'jwt',
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
    },
})

export { handler as GET, handler as POST }