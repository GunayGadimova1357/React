import { useState, type FormEvent } from "react";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AuthService } from "@/services/AuthService";
import { Link } from "react-router-dom";
import GoogleButton from "../GoogleButton";

interface Props {
  email: string;
  setEmail: (val: string) => void;
  onNext: () => void;
}

const EmailStep: React.FC<Props> = ({ email, setEmail, onNext }) => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const available = await AuthService.checkEmail(email);
      if (available) {
        onNext();
      } else {
        setError(t("signup.email_already_exists"));
      }
    } catch {
      setError(t("server.server_error"));
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = !email.trim() || loading;

  return (
    <div className="w-full flex flex-col items-center select-none">
      
      <h1 className="text-3xl font-bold mb-8 text-white">{t("signup.sign_up")}</h1>

      <form onSubmit={handleSubmit} className="w-full mb-6">
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            {t("signin.email")}
          </label>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            value={email}
            type="email"
            required
            placeholder="name@domain.com"
            className="w-full px-4 py-3 rounded-lg bg-[#171719] border border-gray-700 placeholder:text-gray-700 text-white truncate"
          />
        </div>

        {error && (
            <div className="flex items-center justify-center text-red-400 text-sm mb-4 gap-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span className="text-center">{error}</span>
            </div>
        )}

        <button
          disabled={isButtonDisabled}
          type="submit"
          className={`w-full px-6 py-3 rounded-full font-semibold transition-all ${
            !isButtonDisabled
              ? "bg-zinc-100 text-black" 
              : "bg-[#171719] text-gray-400 cursor-not-allowed" 
          }`}
        >
          {loading ? t("signin.loading") : t("signin.continue")}
        </button>
      </form>

      <div className="relative flex items-center w-full my-6">
        <div className="flex-1 border-t border-gray-400"></div>
        <span className="px-4 text-sm text-gray-400 select-none">
          {t("signup.or")}
        </span>
        <div className="flex-1 border-t border-gray-400"></div>
      </div>

      
      <div className="flex flex-col justify-center gap-3 text-white font-semibold w-full mb-6">
        <GoogleButton /> 
        
      </div>

      <div className="text-gray-400 text-sm">
        {t("signup.already_have_an_account")}?
        <Link className="ml-1 text-zinc-200 no-underline" to="/login" replace>
          {t("signin.sign_in")}
        </Link>
      </div>
    </div>
  );
};

export default EmailStep;