import React, { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { ChevronLeft } from "lucide-react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const LogIn: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailValue || !passwordValue) {
      setError(t("login.fill_all_fields"));
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, emailValue, passwordValue);
      navigate("/"); 
    } catch (error: unknown) {
        if (error instanceof Error){
            console.error("Login failed:", error);
            setError(error.message || t("log_in_error"));
        }else{
            setError(t("log_in_error"))
        }
    }
  };
  const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
    navigate("/"); 
  } catch (error) {
    console.error("Google login error:", error);
    setError(t("log_in_error")); 
  }
};

  const isDisabled = !emailValue.trim() || !passwordValue.trim();

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#121212]">
        <ChevronLeft
        onClick={() => navigate("/")}
        className="cursor-pointer absolute top-5 left-5 w-6 h-6 sm:w-9 sm:h-9 text-white sm:bg-[#222222] rounded-full p-1 hover:bg-black transition-all"
/>

      <div className="pt-30 min-h-screen min-w-screen sm:min-h-0 sm:min-w-0 w-full max-w-md flex flex-col items-center rounded-lg p-10 sm:p-12">
        <h1 className="text-3xl font-bold mb-8 text-white">{t("login.log_in")}</h1>

        <div className="flex flex-col justify-center gap-3 text-white font-semibold w-full">
            <button
            onClick={handleGoogleLogin}
            className="cursor-pointer w-full px-6 py-3 rounded-full text-base relative flex items-center border border-gray-600 hover:border-[#a52a2a]"
            >
            <FcGoogle className="w-6 h-6" />
            <span className="flex-1 text-center text-sm sm:text-base">
                {t("login.login_with")} Google
            </span>
            </button>
        </div>

        <div className="relative flex items-center w-full my-6 ">
          <div className="flex-1 border-t border-gray-400"></div>
          <span className="px-4 text-sm text-gray-400 select-none">{t("login.or")}</span>
          <div className="flex-1 border-t border-gray-400"></div>
        </div>

        <form className="w-full mb-6" onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">
              {t("login.email")}
            </label>
            <input
              type="email"
              placeholder= {t("login.email")}
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#171719] border border-gray-700 placeholder:text-gray-700 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">
              {t("login.password")}
            </label>
            <input
              type="password"
              placeholder= {t("login.password")}
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
            disabled={isDisabled}className={`w-full px-5 py-3 mt-2 rounded-full font-semibold transition-all ${
              isDisabled
                ? "bg-[#171719] text-gray-400 cursor-not-allowed"
                : "bg-[#cc3636] text-black"
            }`}
          >
            {t("login.continue")}
          </button>
        </form>

        <div className="text-white">
          {t("login.no_account")}?
          <a className="ml-1 text-[#cc3636] no-underline" href="/signup">
            {t("login.sign_up")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default LogIn;