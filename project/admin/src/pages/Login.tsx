import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    const to = location?.state?.from?.pathname ?? "/";
    return <Navigate to={to} replace />;
  }

  const submit = async () => {
    const identifier = emailOrUsername.trim();
    const pass = password.trim();

    if (!identifier || !pass) {
      toast.error("Enter email/username and password");
      return;
    }

    setLoading(true);
    try {
      await login(identifier, pass);
      const to = location?.state?.from?.pathname ?? "/";
      navigate(to, { replace: true });
    } catch (e: any) {
      toast.error(e?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-900 bg-zinc-950 p-6">
        <h1 className="mb-6 text-xl font-semibold text-zinc-100">Admin login</h1>

        <div className="space-y-4">
          <input
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            placeholder="Email or username"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-100 text-zinc-100"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-100 text-zinc-100"
          />

          <button
            disabled={loading}
            onClick={submit}
            className="mt-2 w-full rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
