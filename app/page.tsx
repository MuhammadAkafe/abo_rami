import { SignInButton } from "@clerk/nextjs";
import { SignUpButton } from "@clerk/nextjs";
import { CLIENT_ROUTES } from "@/app/constans/constans";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4" >
      <SignInButton>
        Sign In
      </SignInButton>
      <SignUpButton >
        Sign Up
      </SignUpButton>
    </div>
  );
}
