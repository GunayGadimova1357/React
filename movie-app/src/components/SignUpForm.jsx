const SignUpForm = ({
  formData,
  onChange,
  onSubmit,
  onSwitch,
}) => {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-slate-900 shadow-lg shadow-slate-200/70">
      <div className="mb-5">
        <div>
          <h3 className="text-2xl font-semibold">Sign up</h3>
          <p className="mt-2 text-sm text-slate-500">
            Create a new account to save your movie experience.
          </p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
            name="name"
            onChange={onChange}
            placeholder="John Doe"
            value={formData.name}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
            name="email"
            onChange={onChange}
            placeholder="movie@app.com"
            type="email"
            value={formData.email}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
            name="password"
            onChange={onChange}
            placeholder="********"
            type="password"
            value={formData.password}
          />
        </label>

        <button
          className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          type="submit"
        >
          Create account
        </button>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <button
            className="font-semibold text-sky-600 transition hover:text-sky-500"
            onClick={onSwitch}
            type="button"
          >
            Log in
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
