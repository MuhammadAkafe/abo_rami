import LoginPageClient from '@/app/client/UserLogin/LoginPageClient'
import { requireAuth } from '@/lib/session'
export default async function LoginPage() {
  return <LoginPageClient />
}

