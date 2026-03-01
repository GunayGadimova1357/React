import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(t("login.error_fields"));
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);
      toast.success(t("login.success_msg"));
      navigate("/", { replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 text-white">
      <div className="w-full max-w-[380px] space-y-8 rounded-3xl border border-zinc-900 bg-zinc-900/40 p-10 shadow-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-zinc-100">{t("login.title")}</h1>
          <p className="mt-2.5 text-sm text-zinc-500">{t("login.subtitle")}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="ml-1 text-sm font-medium text-zinc-400">
              {t("login.email_label")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 outline-none transition-all focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="ml-1 text-sm font-medium text-zinc-400">
              {t("login.password_label")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 outline-none transition-all focus:border-zinc-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-zinc-100 py-3 text-sm font-semibold text-zinc-950 transition-all hover:bg-white active:scale-[0.98] disabled:opacity-50 shadow-xl"
          >
            {isLoading ? t("login.button_loading") : t("login.button_continue")}
          </button>
        </form>
      </div>
    </div>
  );
}
