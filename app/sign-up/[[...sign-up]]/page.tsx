import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center h-screen bgblack">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary:
              'bg-blue-500 hover:bg-blue-600 text-sm normal-case',
          },
        }}
      />
    </div>
  ); 
}
