import { getAuth, signOut, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const useAuthActions = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err: unknown) {
      console.error(t("errors.logout"), err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
        navigate("/signup");
      }
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code: string }).code === "auth/requires-recent-login"
      ) {
        alert(t("errors.requiresRecentLogin"));
      } else {
        console.error(t("errors.deleteAccount"), err || t("errors.unexpected"));
      }
    }
  };

  return { handleLogout, handleDeleteAccount };
};

