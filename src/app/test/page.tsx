import { getBrands } from '@/utils/supabase/brands';

export default async function test() {
  const devices = await getBrands();

  console.log(devices);

  return <div className=""></div>;
}
