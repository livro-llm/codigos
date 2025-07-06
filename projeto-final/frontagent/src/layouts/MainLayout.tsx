import React, { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAuthStore } from "@/stores/Auth/useAuthStore";
import { useSidebarStore } from "@/stores/Sidebar/useSidebarStore";
import LoginScreen from "@/layouts/LoginScreen";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setOpen } = useSidebarStore();
  const { user } = useAuthStore();
  const baseURL = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setOpen]);

  return (
    <GoogleOAuthProvider clientId={baseURL}>
      <div className="flex h-screen bg-white dark:bg-black text-black dark:text-white">
        {!user ? (
          <LoginScreen />
        ) : (
          <AuthenticatedLayout>{children}</AuthenticatedLayout>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
