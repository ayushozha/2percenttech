import type { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
  title: 'Sign in · 2% Tech Backstage',
  description: 'Sign in to the 2% Tech backstage — events, judging and sponsor queries.',
};

export default function SignIn() {
  return <AuthForm mode="signin" />;
}
