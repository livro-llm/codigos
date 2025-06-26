import { createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import { lazy } from "react";

import Loading from "@/components/Loading";
const Home = lazy(() => import("@/pages/Home"));
const Profile = lazy(() => import("@/pages/Profile"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "/profile",
    element: (
      <Suspense fallback={<Loading />}>
        <Profile />
      </Suspense>
    ),
  },
]);

export default router;
