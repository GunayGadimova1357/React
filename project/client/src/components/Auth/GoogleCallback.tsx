import { useEffect, useRef } from "react";
import Loading from "../Loading";
import { AuthService } from "@/services/AuthService";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (!code || !state) {
      navigate("/login");
      return;
    }

    hasFetched.current = true;

    AuthService.googleCallback(code, state)
      .then((res) => {
        if (res.success) {
          if (res.isNewUser) {
            navigate("/signup", { state: { fromGoogle: true, ...res.data } });
          } else {
            login(res.data.accessToken, res.data.userName, res.data.email, res.data.picture);
            navigate("/");
          }
        }
      })
      .catch((err) => {
        console.error("Google Auth Error:", err.response?.data || err);
        navigate("/login");
      });
  }, [navigate, location, login]);

  return <Loading />;
};

export default GoogleCallback;