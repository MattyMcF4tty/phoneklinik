import { NextPage } from 'next';
import LoginForm from '@/components/forms/auth/LoginForm';

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

const LoginPage: NextPage<LoginPageProps> = async ({ searchParams }) => {
  const { error } = await searchParams;

  return (
    <div className="rounded-lg shadow-lg bg-white w-1/5 h-1/2 flex items-center justify-center p-2">
      <LoginForm error={error} />
    </div>
  );
};

export default LoginPage;
