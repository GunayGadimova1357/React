import React, {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { X, Loader2, ShieldCheck, ArrowRight, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

interface OtpVerifyModalProps {
  email: string;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
  onVerify: (code: string) => Promise<any>;
  variant?: "success" | "danger";
}

const OTP_LENGTH = 6;

export default function OtpVerifyModal({
  email,
  onClose,
  onSuccess,
  title,
  description,
  onVerify,
  variant = "success",
}: OtpVerifyModalProps) {
  const { t } = useTranslation();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const v = value.replace(/\D/g, "");
    const nextOtp = [...otp];

    if (v.length > 1) {
      v.slice(0, OTP_LENGTH)
        .split("")
        .forEach((digit, i) => {
          if (index + i < OTP_LENGTH) nextOtp[index + i] = digit;
        });
      setOtp(nextOtp);
      inputRefs.current[Math.min(index + v.length, OTP_LENGTH - 1)]?.focus();
    } else {
      nextOtp[index] = v;
      setOtp(nextOtp);
      if (v && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");

    if (digits.length === 0) return;

    const nextOtp = [...otp];
    digits.forEach((digit, i) => {
      nextOtp[i] = digit;
    });
    setOtp(nextOtp);
    inputRefs.current[Math.min(digits.length - 1, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      return toast.error(t("security.otp_incomplete"));
    }

    try {
      setIsLoading(true);
      await onVerify(code);
      onSuccess();
    } catch (e: any) {
      toast.error(
        e.response?.data?.message ||
          e.response?.data ||
          t("security.otp_invalid"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isDanger = variant === "danger";
  const isComplete = otp.every((v) => v !== "");

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={!isLoading ? onClose : undefined}
      />

      <div className="relative w-full max-w-sm bg-zinc-950 border border-zinc-900 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 text-zinc-500 hover:text-white transition-colors disabled:opacity-0"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={`p-4 rounded-full mb-6 ${isDanger ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"}`}
          >
            {isDanger ? <Trash2 size={32} /> : <ShieldCheck size={32} />}
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-xl font-semibold text-white">
              {title || t("security.otp_title")}
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed px-2">
              {description || t("security.otp_desc")} <br />
              <span className="text-zinc-300 font-medium">{email}</span>
            </p>
          </div>

          <div className="flex gap-2 mb-8">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className={`w-10 h-12 text-center text-xl font-bold bg-zinc-900 border border-zinc-800 rounded-lg text-white outline-none transition-all ${
                  isDanger
                    ? "focus:border-red-500/50"
                    : "focus:border-green-500/50"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={isLoading || !isComplete}
            className={`flex items-center justify-center gap-2 w-full py-3.5 font-semibold text-sm rounded-lg active:scale-[0.98] transition-all disabled:opacity-20 disabled:cursor-not-allowed ${
              isDanger
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-white text-zinc-950 hover:bg-zinc-200"
            }`}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                {isDanger ? <Trash2 size={18} /> : <ArrowRight size={18} />}
                {isDanger
                  ? t("account.delete_confirm_btn")
                  : t("security.verify_btn")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
