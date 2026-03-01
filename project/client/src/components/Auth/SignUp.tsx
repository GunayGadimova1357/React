import React, { useEffect, useState } from "react";
import EmailStep from "@/components/Auth/steps/EmailStep";
import PasswordStep from "@/components/Auth/steps/PasswordStep";
import UsernameStep from "@/components/Auth/steps/UsernameStep";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const SignUpPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const fromGoogle = location.state?.fromGoogle || false;

  const [step, setStep] = useState(fromGoogle ? 3 : 1);
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState(
    location.state?.suggestedUserName || "",
  );

  useEffect(() => {
    if (fromGoogle) {
      setStep(3);
      if (location.state?.email) setEmail(location.state.email);
      if (location.state?.suggestedUserName)
        setUsername(location.state.suggestedUserName);
    }
  }, [fromGoogle, location.state]);

  const handleGlobalBack = () => {
    if (fromGoogle) {
      navigate("/login");
      return;
    }

    if (step === 1) {
      navigate(-1);
    } else if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#121212]">
      <button
        onClick={handleGlobalBack}
        className="absolute top-5 left-5 w-10 h-10 flex items-center justify-center
                   rounded-full border border-white/10 bg-white/5 text-gray-300 
                   transition shadow-lg backdrop-blur-sm hover:bg-white/10 
                   hover:border-white/20 hover:text-white cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="pt-30 min-h-screen min-w-screen sm:min-h-0 sm:min-w-0 w-full max-w-md flex flex-col items-center rounded-lg p-10 sm:p-12">
        {step === 1 && (
          <EmailStep
            email={email}
            setEmail={setEmail}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <PasswordStep
            password={password}
            confirmPassword={confirmPassword}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            onNext={() => setStep(3)}
            onBack={handleGlobalBack}
          />
        )}

        {step === 3 && (
          <UsernameStep
            username={username}
            setUsername={setUsername}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            location={location}
            onBack={handleGlobalBack}
          />
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
