import MainLayout from "@/layouts/MainLayout";
import { useAuthStore } from "@/stores/Auth/useAuthStore";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { ModeToggle } from "@/components/Reusable/ThemeToggle";

const Profile: React.FC = () => {
  const { user, logout } = useAuthStore();

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

  return (
    <MainLayout>
      <main className="flex flex-grow flex-col px-4 py-8 md:px-8 bg-white dark:bg-black">
        <header className="hidden md:flex mb-4 items-center justify-end">
          <ModeToggle />
        </header>
        <div className="flex flex-col lg:flex-row gap-8 w-full h-full">
          {/* Coluna Esquerda */}
          <div className="flex flex-col items-center lg:items-start bg-muted dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full lg:w-1/3">
            <img
              src={user?.picture}
              alt={user?.name}
              className="w-28 h-28 rounded-full shadow-md ring-2 ring-primary mb-4"
            />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white text-center lg:text-left">
              {user?.name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center lg:text-left break-all">
              {user?.email}
            </p>

            <Button
              variant="outline"
              className="mt-6 w-full lg:w-auto"
              onClick={() => {
                if (window.confirm("Deseja realmente sair?")) {
                  logout();
                }
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>

          {/* Coluna Direita */}
          <div className="flex flex-col justify-start gap-6 bg-muted dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full lg:w-2/3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Informações do Usuário
            </h2>
            <div className="space-y-4 text-sm text-gray-800 dark:text-gray-300">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Horas de chat utilizadas:
                </span>{" "}
                {usedHours} horas
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Seu plano atual:
                </span>{" "}
                {plan}
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Último login:
                </span>{" "}
                {formattedLoginDate}
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default Profile;
