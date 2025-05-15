'use server';

import { createClient } from '@/lib/supabase/serverClient';
import AppError from '@/schemas/errors/appError';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/admin/dashboard');
}

export async function forgottenPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: '/admin/auth/reset-password',
  });

  if (error) {
    redirect(`/auth/admin/login?error=${encodeURIComponent(error.message)}`);
  }
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new AppError(
      'Something went wrong signing out',
      `Unexpected error signing out: ${error.message}`,
      500
    );
  }

  redirect('/');
}
