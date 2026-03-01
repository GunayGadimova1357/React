import React, {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { Info, MailCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthService } from "@/services/AuthService";

const OTP_LENGTH = 6;
type OtpMode = "confirmEmail" | "changeEmail";

const OtpVerification: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userEmail, setEmailVerified } = useAuth() as any;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [mode, setMode] = useState<OtpMode>("confirmEmail");

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [changeEmailLoading, setChangeEmailLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isConfirmed) inputRefs.current[0]?.focus();
  }, [isConfirmed]);

  useEffect(() => {
    setNewEmail(userEmail || "");
  }, [userEmail]);

  const handleChange = (index: number, value: string) => {
    const v = value.replace(/\D/g, "");
    const next = [...otp];

    if (v.length > 1) {
      v.slice(0, OTP_LENGTH)
        .split("")
        .forEach((d, i) => {
          if (index + i < OTP_LENGTH) next[index + i] = d;
        });

      setOtp(next);
      inputRefs.current[Math.min(index + v.length, OTP_LENGTH - 1)]?.focus();
    } else {
      next[index] = v;
      setOtp(next);
      if (v && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    setError("");
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

    if (!digits.length) return;

    const next = [...otp];
    digits.forEach((d, i) => (next[i] = d));
    setOtp(next);
    inputRefs.current[Math.min(digits.length - 1, OTP_LENGTH - 1)]?.focus();
    setError("");
  };

  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setError(t("otp.enter_all_digits"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (mode === "changeEmail") {
        const success = await AuthService.verifyEmailChangeOtp(code);

        if (success) {
          setIsConfirmed(true);

          setTimeout(() => {
            navigate("/", { replace: true });
          }, 1500);
        }

        return;
      }

      const ok = await AuthService.verifyOtp(code);
      if (ok) {
        setIsConfirmed(true);
        setEmailVerified(true);

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      }
    } catch (e: any) {
      setError(e?.message || t("otp.verification_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError("");

    try {
      if (mode === "changeEmail") {
        if (!newEmail.trim()) throw new Error("Введите email");
        await AuthService.requestEmailChangeOtp(newEmail);
        setPendingEmail(newEmail);
      } else {
        await AuthService.requestNewOtp();
      }

      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (e: any) {
      setError(e?.message || t("otp.resend_failed"));
    } finally {
      setResendLoading(false);
    }
  };

  const handleChangeEmailRequestOtp = async () => {
    const email = (newEmail || "").trim().toLowerCase();
    if (!email) {
      setError(t("otp.enter_email") || "Введите email");
      return;
    }

    setChangeEmailLoading(true);
    setError("");

    try {
      await AuthService.requestEmailChangeOtp(email);

      setPendingEmail(email);
      setMode("changeEmail");

      setOtp(Array(OTP_LENGTH).fill(""));
      setIsEditingEmail(false);
      inputRefs.current[0]?.focus();
    } catch (e: any) {
      setError(e?.message || t("otp.resend_failed"));
    } finally {
      setChangeEmailLoading(false);
    }
  };

  if (isConfirmed) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#121212] text-white p-6">
        <MailCheck className="w-16 h-16 text-zinc-100 mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold mb-3">{t("otp.success_title")}</h1>

        <p className="text-gray-400 mb-6 text-center">
          {mode === "changeEmail"
            ? t("otp.email_changed_success")
            : t("otp.success_message")}
        </p>
      </div>
    );
  }

  const otpCode = otp.join("");
  const disabled = loading || otpCode.length !== OTP_LENGTH;

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#121212] p-6">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">
          {mode === "changeEmail"
            ? t("otp.confirm_new_email")
            : t("otp.confirm_email")}
        </h1>

        <p className="text-gray-400 mb-2 text-center">
          {t("otp.code_sent_to")}:{" "}
          <span className="font-semibold text-white">
            {mode === "changeEmail" ? pendingEmail : userEmail}
          </span>
        </p>

        {mode !== "changeEmail" && (
          <button
            onClick={() => {
              setIsEditingEmail((v) => !v);
              setError("");
              setNewEmail(userEmail || "");
            }}
            className="text-sm text-gray-400 hover:text-white transition-colors mb-4"
          >
            {t("otp.wrong_email_change")}
          </button>
        )}

        {isEditingEmail && (
          <div className="w-full mb-4">
            <input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="example@mail.com"
              className="w-full px-4 py-3 rounded-lg bg-[#171719] border border-gray-700 text-white focus:outline-none"
            />

            <button
              onClick={handleChangeEmailRequestOtp}
              disabled={changeEmailLoading}
              className="mt-3 w-full px-6 py-3 rounded-full bg-white text-black font-semibold disabled:opacity-50"
            >
              {changeEmailLoading
                ? t("common.loading")
                : t("otp.send_code_to_new_email")}
            </button>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          {otp.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              value={d}
              maxLength={1}
              inputMode="numeric"
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="w-12 h-14 text-center text-2xl bg-[#171719] border border-gray-700 rounded-lg text-white focus:outline-none"
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm mb-3">
            <Info className="w-4 h-4" /> {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={disabled}
          className={`w-full px-6 py-3 rounded-full font-semibold transition-colors ${
            disabled
              ? "bg-[#171719] text-gray-400 cursor-not-allowed"
              : "bg-zinc-100 text-black hover:bg-zinc-200"
          }`}
        >
          {loading ? t("common.loading") : t("otp.confirm")}
        </button>

        <button
          onClick={handleResend}
          disabled={resendLoading}
          className="mt-4 text-zinc-100 font-semibold disabled:opacity-50"
        >
          {resendLoading ? t("otp.resending") : t("otp.resend_code")}
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;
