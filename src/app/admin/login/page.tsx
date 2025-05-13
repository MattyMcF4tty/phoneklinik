import { NextPage } from 'next';
import { login } from './actions';

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

const LoginPage: NextPage<LoginPageProps> = async ({ searchParams }) => {
  const { error } = await searchParams;

  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      {error && <p className="text-red-500">{error}</p>}
      <button formAction={login}>login</button>
    </form>
  );
};

export default LoginPage;
