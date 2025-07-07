import { NextPage } from 'next';
import { redirect } from 'next/navigation';
import { resetPassword } from './actions';

interface PageProps {
  searchParams: Promise<{ code: string; error: string }>;
}

const Page: NextPage<PageProps> = async ({ searchParams }) => {
  const { code, error } = await searchParams;

  console.log(code);
  if (!code) {
    const errorMsg = encodeURI(
      'Der mangler en nulstillingskode. Prøv venligst igen fra linket i din email.'
    );
    redirect(`/admin/auth/login?error=${errorMsg}`);
  }

  return (
    <div>
      <form>
        <input id="code" name="code" type="text" hidden={true} value={code} />
        <input
          id="password"
          name="password"
          type="password"
          placeholder="New password"
        />
        <button formAction={resetPassword}>Reset password</button>
        {error && <p className="text-red-500 font-bold">{error}</p>}
      </form>
    </div>
  );
};

export default Page;
