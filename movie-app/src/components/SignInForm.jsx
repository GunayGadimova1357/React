const SignInForm = ({
  formData,
  onChange,
  onSubmit,
  onSwitch,
}) => {
  return (
    <div className="rounded-[1.75rem] border border-slate-900 bg-slate-900 p-6 text-white shadow-lg shadow-slate-900/15">
      <div className="mb-5">
        <div>
          <h3 className="text-2xl font-semibold">Log in</h3>
          <p className="mt-2 text-sm text-slate-300">Use your account details to continue.</p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Email</span>
          <input
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-sky-400"
            name="email"
            onChange={onChange}
            placeholder="movie@app.com"
            type="email"
            value={formData.email}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Password</span>
          <input
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-sky-400"
            name="password"
            onChange={onChange}
            placeholder="********"
            type="password"
            value={formData.password}
          />
        </label>

        <button
          className="w-full rounded-2xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
          type="submit"
        >
          Continue
        </button>

        <p className="text-center text-sm text-slate-300">
          Don&apos;t have an account?{' '}
          <button
            className="font-semibold text-sky-300 transition hover:text-sky-200"
            onClick={onSwitch}
            type="button"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignInForm;
