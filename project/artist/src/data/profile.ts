export type UserProfile = {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string | null;
};

export const profileData: UserProfile = {
  id: "user-1",
  name: "Aleksey Silence",
  email: "silence@producer.com",
  bio: "Sound designer and electronic music producer based in Berlin. Focused on deep melodic techno and ambient textures.",
  avatarUrl: null, 
};