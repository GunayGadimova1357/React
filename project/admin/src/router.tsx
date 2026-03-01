import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Artists } from "./pages/Artists";
import { Tracks } from "./pages/Tracks";
import { Login } from "./pages/Login";
import { Albums } from "./pages/Albums";
import { RequireAuth } from "./router/RequireAuth";
import { Settings } from "./pages/Settings";
import { Profile } from "./pages/Profile";
import { Users } from "./pages/Users";
import { Team } from "./pages/Team";
import { ArtistApplications } from "./pages/ArtistApplications";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "artists", element: <Artists /> },
      { path: "tracks", element: <Tracks /> },
      { path: "albums", element: <Albums /> },
      { path: "settings", element: <Settings /> },
      { path: "profile", element: <Profile /> },
      { path: "users", element: <Users /> },
      { path: "team", element: <Team /> },
      { path: "artist-applications", element: <ArtistApplications /> }
    ],
  },
  { path: "/login", element: <Login /> },
]);