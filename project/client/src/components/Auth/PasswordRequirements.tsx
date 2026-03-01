import React from "react";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PasswordRequirementsProps {
  password: string;
  className?: string;
}
const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
  className = "",
}) => {
  const { t } = useTranslation();

  const requirements = [
    {
      id: "length",
      test: password.length >= 8,
      text: t("requirements.pass_must_be_at_least_8_characters_long"),
    },
    {
      id: "letter",
      test: /[A-Za-z]/.test(password),
      text: t("requirements.pass_must_contain_at_least_one_letter"),
    },
    {
      id: "number",
      test: /\d/.test(password),
      text: t("requirements.pass_must_contain_at_least_one_number"),
    },
    {
      id: "special",
      test: /[@$!%*?&]/.test(password),
      text: t("requirements.pass_must_contain_at_least_one_special_character"),
    },
  ];

  return (
    <div className={`font-medium text-white text-sm flex flex-col gap-1 ${className}`}>
      <p className="text-sm sm:text-base mb-1">
        {t("requirements.pass_requirements")}:
      </p>

      {requirements.map((req) => (
        <div key={req.id} className="flex items-center gap-2 p-[2px]">
          <div
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
              req.test
                ? "bg-zinc-500 border border-zinc-400"
                : "bg-slate-600 border border-gray-500"
            }`}
          >
            {req.test ? (
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            ) : (
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full"></div>
            )}
          </div>

          <p
            className={`text-xs sm:text-sm transition-colors duration-300 ${
              req.test ? "text-green-300" : "text-white/60"
            }`}
          >
            {req.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PasswordRequirements;
