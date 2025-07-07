import { forgottenPassword } from '@/app/(pages)/admin/auth/login/actions';
import React, { FC } from 'react';

const ForgotPasswordForm: FC = () => {
  return (
    <form>
      <input type="email" className="default-input" />
      <button formAction={forgottenPassword}>Submit</button>
    </form>
  );
};

export default ForgotPasswordForm;
