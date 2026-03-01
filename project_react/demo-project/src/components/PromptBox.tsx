import React, { useState } from "react";
import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import useIsMobile from "../hooks/useIsMobile";

const PromptBox = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setResponse(`${t("prompt.aiResponse")}: "${prompt}"`);
    setPrompt("");
  };

  return (
    <div
      className={`flex flex-col items-center ${
        isMobile ? "w-full px-4 pt-4 pb-20" : "w-[80%] mt-[30%] -translate-x-[-25%]"
      }`}
    >
      {!isMobile && !response && (
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-200 mb-8 text-center">
          {t("prompt.title")}
        </h1>
      )}

      {response && (
        <div className={`mb-24 w-full max-w-2xl bg-[#1e1e1e] p-4 rounded-lg text-gray-300"
            ${isMobile ? "mt-24" : "mt-8"}`}
            >
          {response}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-2xl flex items-center bg-[#2a2a2a] rounded-full px-4 py-3 shadow-md
          ${isMobile ? "fixed left-0 right-0 mx-auto w-[95%] safe-bottom" : "mt-0"}
        `}
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t("prompt.placeholder")}
          className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none px-2"
        />
        <button
          type="submit"
          className="text-gray-400 hover:text-white transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default PromptBox;