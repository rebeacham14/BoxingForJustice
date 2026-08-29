import { SignUp } from '@clerk/clerk-react';

export default function RegisterPage() {
  return (
    <div className="page register-page">
      <section className="auth-box">
        <SignUp
          routing="virtual"
          signInUrl="/mma-events/login"
          fallbackRedirectUrl="/mma-events/orders"
        />
      </section>
    </div>
  );
}
