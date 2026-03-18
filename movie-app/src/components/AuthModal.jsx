import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const initialSignInForm = {
  email: '',
  password: '',
};

const initialSignUpForm = {
  name: '',
  email: '',
  password: '',
};

const AuthModal = () => {
  const { isAuthModalOpen, authMode, closeAuthModal, setAuthMode, login, register } =
    useAuthContext();
  const [signInForm, setSignInForm] = useState(initialSignInForm);
  const [signUpForm, setSignUpForm] = useState(initialSignUpForm);

  if (!isAuthModalOpen) {
    return null;
  }

  const handleSignInChange = ({ target }) => {
    const { name, value } = target;
    setSignInForm((current) => ({ ...current, [name]: value }));
  };

  const handleSignUpChange = ({ target }) => {
    const { name, value } = target;
    setSignUpForm((current) => ({ ...current, [name]: value }));
  };

  const resetForms = () => {
    setSignInForm(initialSignInForm);
    setSignUpForm(initialSignUpForm);
  };

  const handleClose = () => {
    resetForms();
    closeAuthModal();
  };

  const handleModeChange = (mode) => {
    setAuthMode(mode);
  };

  const handleSignInSubmit = (event) => {
    event.preventDefault();
    login(signInForm);
    setSignInForm(initialSignInForm);
  };

  const handleSignUpSubmit = (event) => {
    event.preventDefault();
    register(signUpForm);
    setSignUpForm(initialSignUpForm);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl shadow-slate-950/20">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-sky-500">Account</p>
            <h2 className="text-3xl font-semibold text-slate-950">
              {authMode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
          </div>
          <button
            className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            onClick={handleClose}
            type="button"
          >
            Close
          </button>
        </div>

        {authMode === 'login' ? (
          <SignInForm
            formData={signInForm}
            onChange={handleSignInChange}
            onSubmit={handleSignInSubmit}
            onSwitch={() => handleModeChange('register')}
          />
        ) : (
          <SignUpForm
            formData={signUpForm}
            onChange={handleSignUpChange}
            onSubmit={handleSignUpSubmit}
            onSwitch={() => handleModeChange('login')}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
