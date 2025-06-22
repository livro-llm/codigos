import React, { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
//import TopicPanel from "@/components/TopicPanel";
import { Menu } from "lucide-react";
import { useSidebarStore } from "@/stores/useSidebarStore";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, setOpen } = useSidebarStore();

  // Corrigir problema de mobile ↔ desktop
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        setOpen(false); // Fecha drawer no desktop
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setOpen]);

  return (
    <div className="flex h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Conteúdo principal */}
      <div
        className={`flex flex-col flex-grow transition-all duration-300 ease-in-out md:ml-0`}
      >
        {/* Header mobile */}
        <header className="md:hidden flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            aria-label="Open sidebar"
            onClick={() => setOpen(true)}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="ml-4 text-xl font-bold">Just Chat</h1>
        </header>

        {children}
      </div>

      {/* Painel lateral (desktop grande) */}
      {/* <TopicPanel className="hidden lg:flex" /> */}
    </div>
  );
}
