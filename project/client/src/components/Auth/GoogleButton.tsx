import React from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthService } from "@/services/AuthService";
import { useTranslation } from "react-i18next";

const GoogleButton: React.FC = () => {
  const { t } = useTranslation();

  return (
    <button
      onClick={AuthService.redirectToGoogle}
      className="cursor-pointer w-full px-6 py-3 rounded-full text-base flex items-center border border-gray-600 hover:border-zinc-400 transition-all">
      <FcGoogle className="w-5 h-5 mr-3" />
      {t("signin.signin_with")} Google
    </button>
  );
};

export default GoogleButton;
