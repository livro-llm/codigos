import MainLayout from "@/layouts/MainLayout";
import { useAuthStore } from "@/stores/Auth/useAuthStore";
import { ModeToggle } from "@/components/Reusable/ThemeToggle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileInfo from "@/components/Profile/ProfileInfo";
import LogoutDialog from "@/components/Profile/LogoutDialog";
import DeleteAllDialog from "@/components/Profile/DeleteAllDialog";

import { useProfileStore } from "@/stores/Profile/useProfileStore";

const Profile: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { isDeletingAll, deleteAllChats } = useProfileStore();

  const usedHours = 12.5;
  const plan = "Plano Teste";
  const loginDate = user?.loginAt ? new Date(user.loginAt) : null;

  const formattedLoginDate = loginDate
    ? loginDate.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Data não disponível";

  async function handleConfirmLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      setLogoutDialogOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  }

  async function handleConfirmDeleteAll() {
    try {
      await deleteAllChats();
      setDeleteAllDialogOpen(false);
      navigate("/");
    } catch (error) {
      alert("Erro ao deletar chats. Tente novamente.");
    }
  }

  return (
    <MainLayout>
      <main className="flex flex-grow flex-col px-4 py-8 md:px-8 bg-white dark:bg-black">
        <header className="hidden md:flex mb-4 items-center justify-end">
          <ModeToggle />
        </header>
        <div className="flex flex-col lg:flex-row gap-8 w-full h-full">
          <ProfileHeader
            userName={user?.name}
            userPicture={user?.picture}
            userEmail={user?.email}
            isLoggingOut={isLoggingOut}
            onLogoutClick={() => setLogoutDialogOpen(true)}
            onDeleteAllClick={() => setDeleteAllDialogOpen(true)}
          />
          <ProfileInfo
            usedHours={usedHours}
            plan={plan}
            formattedLoginDate={formattedLoginDate}
          />
        </div>

        <LogoutDialog
          userName={user?.name}
          open={logoutDialogOpen}
          onOpenChange={setLogoutDialogOpen}
          onConfirm={handleConfirmLogout}
          isLoading={isLoggingOut}
        />

        <DeleteAllDialog
          open={deleteAllDialogOpen}
          onOpenChange={setDeleteAllDialogOpen}
          onConfirm={handleConfirmDeleteAll}
          isLoading={isDeletingAll}
        />
      </main>
    </MainLayout>
  );
};

export default Profile;
