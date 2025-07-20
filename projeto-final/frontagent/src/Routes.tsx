import { createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import { lazy } from "react";

import Loading from "@/components/Reusable/Loading";
const Home = lazy(() => import("@/pages/Home"));
const Profile = lazy(() => import("@/pages/Profile"));
const Buy = lazy(() => import("@/pages/Buy"));

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
  {
    path: "/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "/buy",
    element: (
      <Suspense fallback={<Loading />}>
        <Buy />
      </Suspense>
    ),
  },
]);

export default router;
