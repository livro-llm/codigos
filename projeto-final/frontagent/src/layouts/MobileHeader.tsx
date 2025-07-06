import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/Reusable/ThemeToggle";
import { useSidebarStore } from "@/stores/Sidebar/useSidebarStore";

export default function MobileHeader() {
  const { setOpen } = useSidebarStore();

  return (
    <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
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
  );
}
