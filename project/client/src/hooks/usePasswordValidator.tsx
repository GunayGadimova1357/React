import { useCallback } from "react";

export const usePasswordValidation = () => {
  const getPasswordError = useCallback(
    (password: string, confirmPassword?: string): string | null => {
      if (password.length < 8) return "pass_must_be_at_least_8_characters_long";

      if (!/[A-Za-z]/.test(password))
        return "pass_must_contain_at_least_one_letter";

      if (!/\d/.test(password)) return "pass_must_contain_at_least_one_number";

      if (!/[@$!%*?&]/.test(password))
        return "pass_must_contain_at_least_one_special_character";

      if (confirmPassword !== undefined && password !== confirmPassword)
        return "passwords_do_not_match";

      return null;
    },
    [],
  );

  const getPasswordStrength = useCallback(
    (password: string): "weak" | "medium" | "strong" => {
      let score = 0;
      if (password.length >= 8) score++;
      if (/[A-Za-z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[@$!%*?&]/.test(password)) score++;

      if (score <= 2) return "weak";
      if (score === 3) return "medium";
      return "strong";
    },
    [],
  );

  return { getPasswordError, getPasswordStrength };
};
