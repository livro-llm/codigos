import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/Auth/useAuthStore";
import { useAssistantsStore } from "@/stores/Chat/useAssistantsStore";
import { useChatStore } from "@/stores/Chat/useChatStore";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useSidebarStore } from "@/stores/Sidebar/useSidebarStore";
import { useState } from "react";

import LogoutDialog from "@/components/Profile/LogoutDialog";

export function LoginDropdown() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const resetAssistants = useAssistantsStore((state) => state.resetAssistants);
  const resetChat = useChatStore((state) => state.resetChat);
  const { setOpen } = useSidebarStore();

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) return null;

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      resetAssistants();
      resetChat();
      setOpen(false);
      navigate("/", { replace: true });
      setLogoutDialogOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProfileClick = () => {
    setOpen(false);
    navigate("/profile");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded">
            <img
              src={user.picture}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {user.name}
              </span>
              <span className="text-[9px] text-gray-500 dark:text-gray-400">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel className="px-3 py-2">
            <div className="flex flex-col">
              <span className="font-semibold">{user.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </span>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={handleProfileClick}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Perfil</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setLogoutDialogOpen(true)}
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutDialog
        userName={user.name}
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />
    </>
  );
}
