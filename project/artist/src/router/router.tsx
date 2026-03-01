import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

import { Layout } from "@/layout/Layout";

import Dashboard from "@/pages/Dashboard";
import { Tracks } from "@/pages/Tracks";
import { Releases } from "@/pages/Releases";
import Analytics from "@/pages/Analytics";
import { Profile } from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: "tracks",
        element: (
          <ProtectedRoute>
            <Tracks />
          </ProtectedRoute>
        ),
      },
      {
        path: "releases",
        element: (
          <ProtectedRoute>
            <Releases />
          </ProtectedRoute>
        ),
      },
      {
        path: "analytics",
        element: (
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      { path: "settings", element: <Settings /> },
    ],
  },
]);




