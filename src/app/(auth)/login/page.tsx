import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-background-secondary border border-border-primary shadow-lg",
              headerTitle: "text-text-primary",
              headerSubtitle: "text-text-secondary",
              formButtonPrimary: "btn-primary",
              formFieldInput: "bg-background-tertiary border-border-primary text-text-primary",
              formFieldLabel: "text-text-primary",
              footerActionLink: "text-accent-primary hover:text-accent-secondary",
              dividerLine: "bg-border-primary",
              dividerText: "text-text-secondary"
            }
          }}
        />
      </div>
    </div>
  )
} 