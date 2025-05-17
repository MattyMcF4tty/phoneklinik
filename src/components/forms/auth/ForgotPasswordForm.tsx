import { forgottenPassword } from '@/app/admin/auth/login/actions';
import React, { FC } from 'react';

interface ForgotPasswordFormProps {}

const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({}) => {
  return (
    <form>
      <input type="email" className="default-input" />
      <button formAction={forgottenPassword}>Submit</button>
    </form>
  );
};

export default ForgotPasswordForm;
