import { authApi as api } from "@/api/clients";

export interface UserProfile {
    id: string;
    userName: string;
    email: string;
    avatarUrl: string | null;
    isConfirmed: boolean;
    createdAt: string;
}

export interface UpdateProfileDto {
    userName?: string;
}

export const AccountService = {
    getMe: () => api.get<UserProfile>("/Account/me").then(res => res.data),

    updateProfile: (data: UpdateProfileDto) =>
        api.put<UserProfile>("/Account/update", data).then(res => res.data),

    uploadAvatar: (file: File) => {
        const formData = new FormData();
        formData.append("avatar", file);

        return api.put("/Account/avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then(res => res.data);
    },

    checkUsername: (username: string) =>
        api.get<boolean>(`/Account/CheckUser?username=${username}`).then(res => res.data),

    checkEmail: (email: string) =>
        api.get<boolean>(`/Account/CheckEmail?email=${email}`).then(res => res.data),

    hasPassword: () =>
        api.get<{ hasPassword: boolean }>("/Account/HasPassword").then(res => res.data),

    changePassword: (data: any) =>
        api.post("/Account/security/change-password", {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
            confirmNewPassword: data.confirmNewPassword
        }).then(res => res.data),

    requestEmailChangeOtp: (newEmail: string) =>
        api.post("/Auth/email/change/request-otp", { newEmail }),

    verifyEmailChange: (code: string) =>
        api.post("/Auth/email/change/verify", { code }),

    requestDeleteAccountOtp: () =>
        api.post("/Account/delete/request-otp").then(res => res.data),

    confirmDeleteAccount: (code: string) =>
        api.post("/Account/delete/confirm", { code }).then(res => res.data)
};