import { prisma } from "@/app/(lib)/prisma"
import NextAuth from "next-auth/next"
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





const handler = NextAuth({
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
                    if (credentials.role === Role.ADMIN) {
                        return await findUser(credentials.email, credentials.role as Role, credentials.password)
                    }
                    else {
                        return await findSupplier(credentials.email, credentials.role as Role, credentials.password)
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
                (session.user as { id: number; role: string }).id = token.id as number
                (session.user as { id: number; role: string }).role = token.role as string
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
    pages: {
        signIn: '/AdminLogin',
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