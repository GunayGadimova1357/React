import { jwtDecode } from "jwt-decode";
import { authApi as api } from "@/api/clients";
import i18n from "i18next";
import { setAccessToken } from "@/services/TokenStore";
import { normalizeEmail } from "@/utils/normalizeEmail";

interface DecodedToken {
  name: string;
  email: string;
}

interface LoginResponse {
  token: string;
  avatarUrl: string;
}

export const AuthService = {
  async login(identifier: string, password: string) {
    const res = await api.post(`/Auth/login`, {
      Identifier: identifier,
      Password: password,
    });

    const { token, avatarUrl } = res.data.data as LoginResponse;

    console.log("Login response:", res.data);
    console.log("Access token:", res.data.data?.token);

    const decoded = jwtDecode<DecodedToken>(token);

    const name =
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    const email =
      decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ];

    console.log("Decoded name:", name);
    console.log("Decoded email:", email);

    console.log("Decoded token:", decoded);

    return {
      token: token,
      name: name,
      email: email,
      avatar: avatarUrl,
    };
  },

  async checkVerification(token: string) {
    const res = await api.get(`/Account/VerificationStatus`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.isEmailVerified;
  },

  async sendVerificationEmail(token: string) {
    console.log("Sending verification email with token:", token);
    try {
      const lang = i18n.language || "en";
      console.log("Detected language:", lang);

      const res = await api.post(
        `/Auth/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": lang,
          },
        },
      );
      console.log("Email sent successfully:", res.data);
      return res;
    } catch (err: any) {
      console.error("Error sending verification:", err.response?.data || err);
      throw err;
    }
  },

  async requestNewOtp() {
    try {
      const lang = i18n.language || "en";
      const res = await api.post(
        `/Auth/confirm`,
        {},
        {
          headers: { "Accept-Language": lang },
        },
      );

      console.log("OTP resent successfully:", res.data);
      return true;
    } catch (err: any) {
      console.error("Error resending OTP:", err.response?.data || err);
      throw err;
    }
  },

  async verifyOtp(code: string): Promise<boolean> {
    try {
      const res = await api.post(`/Auth/verify-otp`, { code });

      if (res.data.success) {
        return true;
      }
      throw new Error("OTP verification failed");
    } catch (err: any) {
      console.error("Error verifying OTP:", err.response?.data || err);
      throw err;
    }
  },

  async checkEmail(email: string): Promise<boolean> {
    const normalized = normalizeEmail(email);
    const res = await api.get(`/Account/CheckEmail?email=${normalized}`);
    return res.data;
  },

  async checkUsername(username: string): Promise<boolean> {
    const res = await api.get(`/Account/CheckUser?username=${username}`);
    return res.data;
  },

  async register(
    email: string,
    username: string,
    password: string,
    confirmPassword: string,
  ) {
    return api.post(`/Auth/register`, {
      Email: email,
      UserName: username,
      Password: password,
      ConfirmPassword: confirmPassword,
    });
  },

  async loginAfterRegister(username: string, password: string) {
    const res = await api.post(`/Auth/login`, {
      Identifier: username,
      Password: password,
    });

    const { token, avatarUrl } = res.data.data;
    const decoded = jwtDecode<DecodedToken>(token);

    const name =
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    const email =
      decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ];

    return { token: token, name: name, email: email, avatar: avatarUrl };
  },

  redirectToGoogle() {
    const baseURL = api.defaults.baseURL || "";
    window.location.replace(`${baseURL}/Auth/google/login`);
  },

  async googleCallback(code: string, state: string) {
    const res = await api.get(`/Auth/google/callback`, {
      params: { code, state },
      withCredentials: true,
    });
    return res.data;
  },

  async googleRegister(data: any) {
    const res = await api.post(`/Auth/google/register`, data);
    return res.data;
  },

  async requestEmailChangeOtp(newEmail: string) {
    try {
      const lang = i18n.language || "en";

      await api.post(
        `/Auth/email/change/request-otp`,
        { NewEmail: newEmail },
        { headers: { "Accept-Language": lang } },
      );

      return true;
    } catch (err: any) {
      console.log(
        "CHANGE EMAIL ERROR:",
        err.response?.status,
        err.response?.data,
      );
      throw new Error(
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message || err.response?.data || "Bad Request",
      );
    }
  },

  async verifyEmailChangeOtp(code: string): Promise<boolean> {
    try {
      const res = await api.post(`/Auth/email/change/verify`, { Code: code });

      const token =
        res.data?.data?.token ??
        res.data?.data?.Token ??
        res.data?.data?.accessToken ??
        res.data?.token ??
        res.data?.Token ??
        res.data?.accessToken ??
        null;

      if (token) setAccessToken(token);

      const success =
        !!res.data?.success ||
        !!res.data?.isSuccess ||
        !!res.data?.data?.success;

      return success;
    } catch (err: any) {
      console.log(
        "VERIFY EMAIL CHANGE ERROR:",
        err.response?.status,
        err.response?.data,
      );
      throw new Error(
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message ||
              err.response?.data ||
              "Verify failed",
      );
    }
  },
};
