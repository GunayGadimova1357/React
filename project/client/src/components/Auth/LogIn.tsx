import React, { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import GoogleButton from "./GoogleButton";
import { useAuth } from "@/hooks/useAuth";
import { authApi as api } from "@/api/clients";

const LogIn: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { login } = useAuth();

  const [identifierValue, setIdentifierValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!identifierValue || !passwordValue) {
      setError(t("login.fill_all_fields"));
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/Auth/login", {
        identifier: identifierValue,
        password: passwordValue,
      });

      const responseData = response.data.data || response.data;

      const token = responseData.accessToken || responseData.token;

      const name = responseData.name || responseData.userName || null;

      const email = responseData.email;

      const picture = responseData.avatarUrl || responseData.picture || responseData.userPicture;

      if (token && email) {
        await login(token, name || email, email, picture);

        navigate("/");
      } else {
        setError(t("login.invalid_response"));
      }

    } catch (err: any) {
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = !identifierValue.trim() || !passwordValue.trim() || isLoading;

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#121212]">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 w-10 h-10 flex items-center justify-center
                   rounded-full bg-white/5 border border-white/10
                   hover:bg-white/10 hover:border-white/20
                   text-gray-300 hover:text-white
                   transition shadow-lg backdrop-blur-sm"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="pt-30 min-h-screen min-w-screen sm:min-h-0 sm:min-w-0 w-full max-w-md flex flex-col items-center rounded-lg p-10 sm:p-12">
        <h1 className="text-3xl font-bold mb-8 text-white">{t("signin.sign_in")}</h1>

        <div className="flex flex-col justify-center gap-3 text-white font-semibold w-full">
          <GoogleButton />
        </div>

        <div className="relative flex items-center w-full my-6 ">
          <div className="flex-1 border-t border-gray-400"></div>
          <span className="px-4 text-sm text-gray-400 select-none">{t("signin.or")}</span>
          <div className="flex-1 border-t border-gray-400"></div>
        </div>

        <form className="w-full mb-6" onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">
              {t("signin.identifier")}
            </label>
            <input
              type="text" 
              placeholder={t("signin.identifier_placeholder")}
              value={identifierValue}
              onChange={(e) => setIdentifierValue(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#171719] border border-gray-700 placeholder:text-gray-700 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">
              {t("signin.password")}
            </label>
            <input
              type="password"
              placeholder="Password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#171719] border border-gray-700 placeholder:text-gray-700 text-white"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm mb-4 text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={isDisabled}
            className={`w-full px-5 py-3 mt-2 rounded-full font-semibold transition-all flex items-center justify-center ${isDisabled
                ? "bg-[#171719] text-gray-400 cursor-not-allowed"
                : "bg-zinc-100 text-black hover:bg-zinc-400"
              }`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              t("signin.continue")
            )}
          </button>
        </form>

        <div className="text-gray-400 text-sm">
          {t("signin.no_account")}?
          <a className="ml-1 text-zinc-200 no-underline" href="/signup">
            {t("signin.sign_up")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default LogIn;