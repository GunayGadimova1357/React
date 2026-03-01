export type ArtistApplicationStatus = "pending" | "approved" | "rejected";

export type ArtistApplication = {
  id: string;
  userId: string;
  email: string;
  stageName: string;
  country: string;

  musicLink: string;
  about?: string;

  links?: {
    spotify?: string;
    soundcloud?: string;
    youtube?: string;
    instagram?: string;
    tiktok?: string;
  };

  status: ArtistApplicationStatus;
  createdAt: string;
};

export const artistApplications: ArtistApplication[] = [
  {
    id: "app_1",
    userId: "u_1",
    email: "user1@mail.com",
    stageName: "Weeknd",
    country: "US",
    musicLink: "https://spotify.com/artist/123",
    about: "Independent artist",
    status: "pending",
    createdAt: "2024-01-23",
  },
];
