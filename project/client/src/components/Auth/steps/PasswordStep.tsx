import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import PasswordRequirements from "@/components/Auth/PasswordRequirements";
import { usePasswordValidation } from "@/hooks/usePasswordValidator";

interface Props {
  password: string;
  confirmPassword: string;
  setPassword: (val: string) => void;
  setConfirmPassword: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const PasswordStep: React.FC<Props> = ({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  onNext,
  onBack,
}) => {
  const { t } = useTranslation();
  const { getPasswordError } = usePasswordValidation();

  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const passError = getPasswordError(password, confirmPassword);

    setError("");

    if (passError) {
      setError(t("requirements." + passError));
      return;
    }
    onNext();
  };

  const isButtonDisabled = !password.trim() || !confirmPassword.trim();

  return (
    <div className="w-full flex flex-col items-center select-none relative">

      <h1 className="text-3xl font-bold mb-8 text-white">
        {t("signup.create_a_password")}
      </h1>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            {t("signin.password")}
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="********"
              className="w-full px-4 py-3 rounded-lg bg-[#171719] border border-gray-700 placeholder:text-gray-700 text-white"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            {t("signin.confirm_password")}
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              placeholder="********"
              className="w-full px-4 py-3 rounded-lg bg-[#171719] border border-gray-700 placeholder:text-gray-700 text-white"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <PasswordRequirements password={password} className="mt-5 mb-5" />

        {error && (
          <div className="flex items-center justify-center text-red-400 text-sm mb-4 gap-2">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span className="text-center">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isButtonDisabled}
          className={`mt-4 w-full px-6 py-3 rounded-full font-semibold transition-all ${!isButtonDisabled
              ? "bg-zinc-100 text-black"
              : "bg-[#171719] text-gray-400 cursor-not-allowed"
            }`}
        >
          {t("signin.continue")}
        </button>
      </form>
    </div>
  );
};

export default PasswordStep;