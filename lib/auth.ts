import { prisma } from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { Role } from "@prisma/client"

const findUser = async (email: string, role: Role, password: string) => {

    const user = await prisma.users.findUnique({
        where: { email: email },
    })
    if (!user) {
        console.log('User not found:', email)
        return null
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        console.log('Invalid password for user:', email)
        return null
    }
    return {
        ...user,
        id: user.id.toString(),
        name: `${user.firstName} ${user.lastName}`
    }
}

const findSupplier = async (email: string, role: Role, password: string) => {
    const supplier = await prisma.suppliers.findUnique({
        where: { email: email },
    })
    if (!supplier) {
        console.log('Supplier not found:', email)
        return null
    }
    const isPasswordValid = await bcrypt.compare(password, supplier.password)
    if (!isPasswordValid) {
        console.log('Invalid password for supplier:', email)
        return null
    }
    return {
        ...supplier,
        id: supplier.id.toString(),
        name: `${supplier.firstName} ${supplier.lastName}`
    }
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                role: { label: "Role", type: "string" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password || !credentials?.role) {
                    console.log('Missing credentials')
                    return null
                }
                const emailLowerCase = credentials.email.toLowerCase()
                    if (credentials.role === Role.ADMIN) {
                        return await findUser(emailLowerCase, credentials.role as Role, credentials.password)
                    }
                    else {
                        return await findSupplier(emailLowerCase, credentials.role as Role, credentials.password)
                    }
            },
        }),
    ],
    callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async jwt({ token, user }: { token: any; user: any }) {
            if (user && 'role' in user) {
                token.role = user.role
                token.id = user.id
            }   
            return token
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async session({ session, token }: { session: any; token: any }) {
            if (token && session.user) {
                (session.user as { id: string; role: string }).id = token.id as string
                (session.user as { id: string; role: string }).role = token.role as string
            }
            return session
        },
        async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
            // Handle role-based redirects after login
            if (url.startsWith('/')) {
                return `${baseUrl}${url}`
            }
            return baseUrl
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
    pages: {
        signIn: '/',
        signOut: '/',
    },
    session: {
        strategy: 'jwt' as const,
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
    },
}
