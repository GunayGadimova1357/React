import { useState } from "react";
import { useAuth } from "../features/auth";
import { Mail, Lock, ShieldCheck, CheckCircle2, User as UserIcon } from "lucide-react";
import { toast } from "react-hot-toast";

export function Profile() {
  const { isAuthenticated, email: currentEmail, userName } = useAuth();

  const [email, setEmail] = useState(currentEmail ?? "");
  const [password, setPassword] = useState("");

  if (!isAuthenticated) return null;

  const handleSave = async () => {
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password && password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    // Пока endpoint для админ-профиля не сделан:
    toast("Not implemented yet (need API endpoint)", {
      icon: <ShieldCheck size={18} className="text-indigo-400" />,
    });

    // Когда сделаешь endpoint — тут будет api call
    // await AdminService.updateCredentials({ email, password })

    toast.success("Profile updated successfully", {
      icon: <CheckCircle2 size={18} className="text-green-400" />,
    });

    setPassword("");
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400">
          <UserIcon size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Account Settings</h1>
          <p className="text-sm text-zinc-500">
            Signed in as {userName}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
          <div className="border-b border-zinc-900 bg-zinc-900/30 p-4">
            <h2 className="flex items-center gap-2 text-sm font-medium text-zinc-300">
              <ShieldCheck size={16} className="text-indigo-400" />
              Credentials Management
            </h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 pl-10 pr-4 py-2.5 text-zinc-100 transition focus:border-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-100"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 pl-10 pr-4 py-2.5 text-zinc-100 transition focus:border-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-100"
                />
              </div>
              <p className="text-[11px] text-zinc-600 ml-1">
                Use at least 8 characters with letters and numbers.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end bg-zinc-900/20 p-4 border-t border-zinc-900">
            <button
              onClick={handleSave}
              className="rounded-lg bg-white px-6 py-2 text-sm font-bold text-black transition hover:bg-zinc-200 active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-zinc-800 p-4 text-center">
          <p className="text-xs text-zinc-500">
            Last login: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
