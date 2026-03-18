import { useAuthContext } from '../contexts/AuthContext';

const navItems = ['Home', 'Movies', 'Favorites', 'Profile'];

const Navbar = () => {
  const { currentUser, openAuthModal, logout } = useAuthContext();

  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-slate-950/90 text-white backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-sm text-sky-300">Movie app</p>
          <h1 className="text-2xl font-semibold">Discover films faster</h1>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a
              key={item}
              className="text-sm font-medium text-slate-200 transition hover:text-white"
              href="#"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">{currentUser.name}</p>
                <p className="text-xs text-slate-300">{currentUser.email}</p>
              </div>
              <button
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                onClick={logout}
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                onClick={() => openAuthModal('login')}
                type="button"
              >
                Log in
              </button>
              <button
                className="rounded-full bg-sky-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
                onClick={() => openAuthModal('register')}
                type="button"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
