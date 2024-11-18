import { DeviceSchema } from '@/schemas/deviceScema';
import { SupabaseFunctions } from '@/schemas/supabaseFunctions';
import { createClient } from '@supabase/supabase-js';

export const getSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabasePublicKey = process.env.SUPABASE_PUBLIC_KEY;

  // Validate supabaseUrl and supabasePublicKey.
  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is not defined in envirotment.');
  }
  if (!supabasePublicKey) {
    throw new Error('SUPABASE_PUBLIC_KEY is not defined in envirotment.');
  }

  // Handle errors and potential secret information.
  try {
    const supabaseClient = createClient(supabaseUrl, supabasePublicKey);
    return supabaseClient;
  } catch (error) {
    console.error('Error creating supabaseclient:', error);
    throw new Error('Error creating supabaseclient.');
  }
};

/**
 * Handles the calling of supabase functions.
 * @param functionName The name of the database function you want to call.
 * @param args Potential arguments that the function can have.
 * @returns Returns database data.
 */
export const handleSupabaseFunction = async <K extends keyof SupabaseFunctions>(
  functionName: K,
  args: SupabaseFunctions[K]['Args']
): Promise<SupabaseFunctions[K]['Returns']> => {
  const supaClient = getSupabaseClient();

  // Call the Supabase function with both type arguments
  const { data, error } = await supaClient.rpc<K, SupabaseFunctions[K]>(
    functionName,
    args
  );

  // Handle errors
  if (error) {
    console.error(
      `Error calling database function "${functionName}":`,
      error.hint
    );
    throw new Error(`Error calling database function "${functionName}".`);
  }

  return data;
};
