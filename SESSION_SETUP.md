# Session-Based Authentication Setup

This project now uses a simple session-based authentication system instead of NextAuth.js.

## Environment Variables Required

Add these to your `.env.local` file:

```env
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## How It Works

### 1. Session Management (`lib/session.ts`)
- Uses JWT tokens stored in HTTP-only cookies
- Provides functions for creating, reading, and clearing sessions
- Includes `requireAuth()` for protecting routes

### 2. Authentication Actions (`app/actions/auth.ts`)
- `loginAction()`: Handles login form submission
- `logoutAction()`: Handles logout and session cleanup
- Uses server actions for form handling

### 3. Protected Routes
- Server components use `requireAuth()` to check authentication
- Automatically redirects to sign-in if not authenticated
- Session data is available in server components

### 4. Sign-in Page (`app/client/User/sign-in/page.tsx`)
- Server component that checks for existing sessions
- Uses `LoginForm` client component for form handling
- Redirects authenticated users to dashboard

### 5. Dashboard (`app/client/User/Dashboard/`)
- Server component that requires authentication
- Passes session data to client components
- Uses `UserDashboardClient` for interactive features

## Usage Examples

### Protecting a Server Component
```tsx
import { requireAuth } from '@/lib/session'

export default async function ProtectedPage() {
  const session = await requireAuth() // Redirects if not authenticated
  return <div>Hello {session.firstName}!</div>
}
```

### Checking Session (Optional)
```tsx
import { getSession } from '@/lib/session'

export default async function Page() {
  const session = await getSession()
  if (session) {
    return <div>Welcome back!</div>
  }
  return <div>Please sign in</div>
}
```

### Logout Action
```tsx
import { logoutAction } from '@/app/actions/auth'

// In a form or button
<form action={logoutAction}>
  <button type="submit">Logout</button>
</form>
```

## Security Features

- JWT tokens stored in HTTP-only cookies
- Tokens expire after 24 hours
- Secure cookies in production
- Server-side session validation
- Automatic redirects for unauthenticated users

## Migration from Clerk

The system maintains compatibility with Clerk for admin users while using sessions for supplier authentication. The `ControlPanel` component handles both authentication methods based on the `isAdmin` prop.
