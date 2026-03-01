import { useEffect, useState, type FormEvent } from "react";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AuthService } from "@/services/AuthService";
import { useNavigate, type Location } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface LocationState {
  fromGoogle?: boolean;
  googleId?: string;
  email?: string;
  name?: string;
  picture?: string;
  suggestedUserName?: string;
}

interface Props {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  location: Location<LocationState>;
  setUsername: (val: string) => void;
  onBack: () => void;
}

const UsernameStep: React.FC<Props> = ({
  email,
  password,
  confirmPassword,
  username,
  location,
  setUsername,
  onBack,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fromGoogle = location.state?.fromGoogle;

  useEffect(() => {
    if (fromGoogle && location.state?.suggestedUserName) {
      setUsername(location.state.suggestedUserName);
    }
  }, [fromGoogle, location.state, setUsername]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (fromGoogle) {
        const payload = {
          userInfo: {
            id: location.state?.googleId,
            email: location.state?.email,
            name: location.state?.name,
            picture: location.state?.picture,
          },
          chosenUserName: username,
        };

        const res = await AuthService.googleRegister(payload);
        
        if (res.success) {
          const { accessToken, userName, email: userEmail, picture } = res.data;
          
          await login(accessToken, userName, userEmail, picture);
          
          navigate("/", { replace: true });
        }
      } else {
        const userExists = await AuthService.checkUsername(username);

        if (userExists) {
          await AuthService.register(email, username, password, confirmPassword);

          const res = await AuthService.loginAfterRegister(username, password);
          
          await login(res.token, res.name, res.email, res.avatar);

          await AuthService.sendVerificationEmail(res.token);

          navigate("/verify-email", { replace: true });
        } else {
          setError(t("signup.username_already_exists"));
        }
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.error || t("signup.registration_failed");
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isButtonDisabled = !username.trim() || isLoading;

  return (
    <div className="w-full flex flex-col items-center select-none relative">
      <h1 className="text-3xl font-bold mb-8 text-white">
        {t("signup.choose_username") || "Choose Username"}
      </h1>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            {t("signup.username")}
          </label>
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            disabled={isLoading}
            autoFocus
            className="w-full px-4 py-3 rounded-lg bg-[#171719] border border-gray-700 outline-none placeholder:text-gray-700 text-white transition-all"
            placeholder={t("signup.enter_username")}
          />
        </div>

        {error && (
          <div className="flex items-center justify-center text-red-400 text-sm mb-4 gap-2">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span className="text-center">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isButtonDisabled}
          className={`mt-4 w-full px-6 py-3 rounded-full font-semibold transition-all ${
            !isButtonDisabled
              ? "bg-zinc-100 text-black" 
              : "bg-[#171719] text-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? t("signin.loading") : t("signin.sign_up")}
        </button>
      </form>
    </div>
  );
};

export default UsernameStep;