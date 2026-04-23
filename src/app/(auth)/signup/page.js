import { redirect } from 'next/navigation';

export default function SignupPage({ searchParams }) {
  const params = new URLSearchParams();
  if (searchParams?.token) params.set('token', searchParams.token);
  if (searchParams?.email) params.set('email', searchParams.email);
  const qs = params.toString();
  redirect(`/onboarding${qs ? `?${qs}` : ''}`);
}
