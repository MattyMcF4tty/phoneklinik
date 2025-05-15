import { NextPage } from 'next';
import { signOut } from '../auth/login/actions';

interface AdminDashboardPageProps {}

const AdminDashboardPage: NextPage<AdminDashboardPageProps> = async ({}) => {
  return (
    <div>
      dashboard
      <form>
        <button formAction={signOut}>Sign out</button>
      </form>
    </div>
  );
};

export default AdminDashboardPage;
