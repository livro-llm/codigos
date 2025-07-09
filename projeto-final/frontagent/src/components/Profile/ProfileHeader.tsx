import { Button } from "@/components/ui/button";
import { LogOut, Trash2, User, Mail } from "lucide-react";

interface ProfileHeaderProps {
  userName?: string;
  userPicture?: string;
  userEmail?: string;
  isLoggingOut: boolean;
  onLogoutClick: () => void;
  onDeleteAllClick: () => void;
}

export default function ProfileHeader({
  userName,
  userPicture,
  userEmail,
  isLoggingOut,
  onLogoutClick,
  onDeleteAllClick,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center lg:items-start bg-muted dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full lg:w-1/3">
      <img
        src={userPicture}
        alt={userName}
        className="w-28 h-28 rounded-full shadow-md ring-2 ring-primary mb-6"
      />
      {/* User Info */}
      <div className="flex flex-col space-y-3 w-full max-w-xs">
        <div className="flex items-center gap-3 text-gray-900 dark:text-white">
          <User className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-semibold truncate">
            {userName || "Usuário"}
          </h1>
        </div>
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 break-all">
          <Mail className="w-5 h-5 text-primary" />
          <p className="text-sm">{userEmail || "Email não disponível"}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8 w-full max-w-xs">
        <Button
          variant="outline"
          className="flex-1 cursor-pointer text-red-600 hover:text-red-800 disabled:bg-transparent disabled:text-red-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          onClick={onLogoutClick}
          disabled={isLoggingOut}
          aria-label="Sair da conta"
          title="Sair da conta"
        >
          <LogOut className="w-5 h-5" />
          {isLoggingOut ? "Saindo..." : "Sair"}
        </Button>

        <Button
          variant="outline"
          className="flex-1 cursor-pointer text-red-600 hover:text-red-800 flex items-center justify-center gap-2"
          onClick={onDeleteAllClick}
          aria-label="Deletar todos os chats"
          title="Deletar todos os chats"
        >
          <Trash2 className="w-5 h-5" />
          Deletar todos os chats?
        </Button>
      </div>
    </div>
  );
}
