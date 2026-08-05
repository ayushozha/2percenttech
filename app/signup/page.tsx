import type { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
  title: 'Create account · 2% Tech Backstage',
  description: 'Create a 2% Tech backstage account to enter the hackathon, judge, or run events.',
};

export default function SignUp() {
  return <AuthForm mode="signup" />;
}
