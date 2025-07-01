import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/Auth/useAuthStore";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";

export function LoginDropdown() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return null;

  return (
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
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
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
          onSelect={() => navigate("/profile")}
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Perfil</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => {
            if (window.confirm("Deseja realmente sair?")) {
              logout();
            }
          }}
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
