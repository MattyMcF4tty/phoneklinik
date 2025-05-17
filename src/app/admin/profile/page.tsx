import { createClient } from '@/lib/supabase/serverClient';
import { ErrorSupabase } from '@/schemas/errors/appErrorTypes';
import { NextPage } from 'next';

interface ProfilePageProps {}

const ProfilePage: NextPage<ProfilePageProps> = async ({}) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new ErrorSupabase(
      'Noget gik galt under hentning af bruger.',
      `Supabase failed to fetch user: ${error.message}`
    );
  }

  const user = data.user;
  return <div className="w-full grow flex">{user.email}</div>;
};

export default ProfilePage;
