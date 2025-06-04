import {
  forgottenPassword,
  login,
} from '@/app/(pages)/admin/auth/login/actions';
import React, { FC } from 'react';

interface LoginFormProps {
  defaultEmail?: string;
  error?: string;
}

const LoginForm: FC<LoginFormProps> = ({ defaultEmail, error }) => {
  return (
    <form className="flex flex-col gap-4">
      <div>
        <label className="label-default" htmlFor="email">
          Email:
        </label>
        <input
          className="input-default"
          id="email"
          name="email"
          type="email"
          required
        />
      </div>
      <div>
        <label className="label-default" htmlFor="password">
          Password:
        </label>
        <input
          className="input-default"
          id="password"
          name="password"
          type="password"
          required
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}
      <button formAction={login}>login</button>
      <button formAction={forgottenPassword}>Glemt kodeord?</button>
    </form>
  );
};

export default LoginForm;
