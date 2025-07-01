import { Menu, Search, Plus, X, Bot } from "lucide-react";
import { useAssistantsStore } from "@/stores/Chat/useAssistantsStore";
import { useSidebarStore } from "@/stores/Sidebar/useSidebarStore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Login from "../Login/Login";

export default function Sidebar() {
  const assistants = useAssistantsStore((state) => state.assistants);
  const selected = useAssistantsStore((state) => state.selectedAssistant);
  const selectAssistant = useAssistantsStore((state) => state.selectAssistant);

  const { isCollapsed, toggleCollapsed, isOpen, setOpen } = useSidebarStore();

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelect = (id: string) => {
    selectAssistant(id);
    if (isMobile) setOpen(false);
  };

  const sidebarWidth = isCollapsed ? "w-16" : "w-64";

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
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Link
              to="/"
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
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
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

      {/* Ações principais */}
      <div className="flex flex-col gap-2 p-4">
        <SidebarItem
          isMobile={isMobile}
          icon={<Plus className="w-5 h-5" />}
          label="Nova conversa"
        />
        <SidebarItem
          isMobile={isMobile}
          icon={<Search className="w-5 h-5" />}
          label="Buscar chat"
        />
      </div>

      <div className="border-t dark:border-gray-700" />

      {/* Lista de chats */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto px-2 space-y-1 mt-2">
          {assistants.map((assistant) => (
            <div
              key={assistant.id}
              onClick={() => handleSelect(assistant.id)}
              className={`cursor-pointer rounded px-2 py-2 ${
                selected === assistant.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              {assistant.name}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {!isCollapsed && <Login />}
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  isMobile,
}: {
  icon: React.ReactNode;
  label: string;
  isMobile: boolean;
}) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded justify-start md:justify-start">
      {icon} {isMobile && label}
      {!isCollapsed && (
        <span className="text-sm hidden md:inline">{label}</span>
      )}
    </div>
  );
}
