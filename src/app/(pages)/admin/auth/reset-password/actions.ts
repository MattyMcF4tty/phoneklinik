'use server';

import { createClient } from '@/lib/supabase/serverClient';
import { redirect } from 'next/navigation';

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();

  const data = {
    code: formData.get('code') as string,
    password: formData.get('password') as string,
  };

  console.log('action code: ' + data.code);
  if (!data.code) {
    console.warn('User tried to reset password code.');
    const errorMsg = encodeURI(
      'Der mangler en nulstillingskode. Prøv venligst igen fra linket i din email.'
    );
    redirect(`/admin/auth/login?error=${errorMsg}`);
  }

  // Check for existing session
  const {
    data: { session: existingSession },
  } = await supabase.auth.getSession();

  if (existingSession) {
    console.warn('User is already signed in. Redirecting to dashboard.');
    redirect('/admin/dashboard');
  }

  // Sign in with session token
  const { error: sessionError } = await supabase.auth.exchangeCodeForSession(
    data.code
  );
  if (sessionError) {
    const errorMsg = encodeURIComponent(
      'Ugyldig eller udløbet nulstillingskode.'
    );
    redirect(`/admin/auth/login?error=${errorMsg}`);
  }

  // Update passwors
  const { error: passwordError } = await supabase.auth.updateUser({
    password: data.password,
  });

  if (passwordError) {
    const errorMsg = encodeURIComponent(passwordError.message);
    redirect(`/admin/auth/reset-password?error=${errorMsg}`);
  }

  redirect('/admin/auth/login');
}
