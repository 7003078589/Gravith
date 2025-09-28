'use client';

import SaaSHomepage from '@/components/SaaSHomepage';

export default function Landing() {
  const handleGetStarted = () => {
    // Navigate to pricing page for new users
    window.location.href = '/pricing';
  };

  const handleLogin = () => {
    // Navigate to login page for existing users
    window.location.href = '/login';
  };

  return (
    <SaaSHomepage 
      onGetStarted={handleGetStarted}
      onLogin={handleLogin}
    />
  );
}
