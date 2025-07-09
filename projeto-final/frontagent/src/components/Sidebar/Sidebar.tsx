import { Menu, Search, Plus, X, Bot } from "lucide-react";
import { useAssistantsStore } from "@/stores/Chat/useAssistantsStore";
import { useSidebarStore } from "@/stores/Sidebar/useSidebarStore";
import { useEffect, useState, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Login from "@/components/Login/Login";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ListChats from "@/components/Sidebar/ListChats";

export default function Sidebar() {
  const selectAssistant = useAssistantsStore((state) => state.selectAssistant);
  const fetchAssistants = useAssistantsStore((state) => state.fetchAssistants);
  const assistants = useAssistantsStore((state) => state.assistants);
  const selected = useAssistantsStore((state) => state.selectedAssistant);

  const { isCollapsed, toggleCollapsed, isOpen, setOpen } = useSidebarStore();

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchAssistants();
  }, [fetchAssistants]);

  useLayoutEffect(() => {
    const pathId = location.pathname.slice(1);
    if (pathId && pathId !== String(selected)) {
      selectAssistant(pathId);
    }
  }, [location.pathname, selected, selectAssistant]);

  const handleSelect = (id: string | number) => {
    selectAssistant(id);
    if (isMobile) setOpen(false);
  };

  const sidebarWidth = isCollapsed ? "w-16" : "w-64";

  const itemHeight = 40; // px - ajuste conforme altura do item
  const maxVisibleItems = 15;
  const maxHeightPx = itemHeight * maxVisibleItems;
  const hasScroll = assistants.length > maxVisibleItems;

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40
        ${sidebarWidth}
        bg-white dark:bg-black border-r border-gray-200 dark:border-gray-700
        transition-transform duration-300 ease-in-out
        transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0 md:flex md:flex-col
        flex flex-col justify-between
      `}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Link
                to="/"
                onClick={() => isMobile && setOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200 cursor-pointer"
                aria-label="Home"
              >
                <Bot className="w-7 h-7 text-primary" />
              </Link>
            </div>
          )}
          {isMobile ? (
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={toggleCollapsed}
              className="p-2 cursor-pointer rounded hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2 p-4">
          <SidebarItem
            isMobile={isMobile}
            icon={<Plus className="w-5 h-5" />}
            label="Nova conversa"
            to="/"
            onClick={() => setOpen(false)}
          />
          <SidebarItem
            isMobile={isMobile}
            icon={<Search className="w-5 h-5" />}
            label="Buscar chat"
          />
        </div>

        <div className="border-t dark:border-gray-700" />

        <div
          style={{ maxHeight: `${maxHeightPx}px` }}
          className={`flex-grow min-h-0 ${
            hasScroll ? "overflow-y-auto" : "overflow-y-visible"
          }`}
        >
          <ListChats isCollapsed={isCollapsed} onSelect={handleSelect} />
        </div>
      </div>

      <div>
        <Login />
      </div>
    </aside>
  );
}
