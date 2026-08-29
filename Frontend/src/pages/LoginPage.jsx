import { SignIn } from '@clerk/clerk-react';

export default function LoginPage() {
  return (
    <div className="page login-page">
      <section className="auth-box">
        <SignIn
          routing="virtual"
          signUpUrl="/mma-events/register"
          fallbackRedirectUrl="/mma-events/orders"
        />
      </section>
    </div>
  );
}
