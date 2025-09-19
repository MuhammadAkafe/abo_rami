// NextAuth type declarations

declare module "next-auth" {
  interface Session {
    user: {
      id: number
      name: string
      email: string
      role: string
    }
  }

  interface User {
    id: number
    name: string
    email: string
    role: string
  }
}
