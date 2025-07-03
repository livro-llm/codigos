import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Menu } from "lucide-react";
import { useSidebarStore } from "@/stores/Sidebar/useSidebarStore";
import { useAuthStore } from "@/stores/Auth/useAuthStore";
import Sidebar from "@/components/Sidebar/Sidebar";
import Login from "@/components/Login/Login";
import { SocketManager } from "@/components/Reusable/SocketManager";
import { ModeToggle } from "@/components/Reusable/ThemeToggle";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, setOpen } = useSidebarStore();
  const { user } = useAuthStore();

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
    <GoogleOAuthProvider clientId="258488583868-8i4ukkesbakfj15a3vqsm8t61gohk51k.apps.googleusercontent.com">
      <div className="flex h-screen bg-white dark:bg-black text-black dark:text-white">
        {!user ? (
          <div className="m-auto text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Bem-vindo ao Just Chat
            </h2>
            <Login />
          </div>
        ) : (
          <>
            <Sidebar />
            {isOpen && (
              <div
                className="fixed  inset-0 bg-black/30 z-30 md:hidden"
                onClick={() => setOpen(false)}
              />
            )}
            <div className="flex flex-col flex-grow transition-all duration-300 ease-in-out md:ml-0">
              <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <button
                  aria-label="Open sidebar"
                  onClick={() => setOpen(true)}
                  className="p-2 cursor-pointer rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Menu className="w-6 h-6" />
                </button>

                <Link
                  to="/"
                  className="text-xl font-bold cursor-pointer select-none"
                  aria-label="Home"
                >
                  Just Chat
                </Link>

                <ModeToggle />
              </header>

              <SocketManager />
              {children}
            </div>
          </>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
