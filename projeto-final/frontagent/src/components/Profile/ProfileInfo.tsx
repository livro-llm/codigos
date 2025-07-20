import { Clock, CreditCard, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileInfoProps {
  usedHours: number;
  plan: string;
  formattedLoginDate: string;
}

export default function ProfileInfo({
  usedHours,
  plan,
  formattedLoginDate,
}: ProfileInfoProps) {
  return (
    <div className="flex flex-col justify-start gap-8 bg-muted dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full lg:w-2/3">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Informações do Usuário
      </h2>
      <Link to="/buy">Comprar</Link>
      <div className="space-y-6 text-sm text-gray-800 dark:text-gray-300">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-primary dark:text-primary-light" />
          <span>
            <span className="font-medium text-gray-900 dark:text-white">
              Horas de chat utilizadas:
            </span>{" "}
            {usedHours} horas
          </span>
        </div>

        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-primary dark:text-primary-light" />
          <span>
            <span className="font-medium text-gray-900 dark:text-white">
              Seu plano atual:
            </span>{" "}
            {plan}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <LogIn className="w-5 h-5 text-primary dark:text-primary-light" />
          <span>
            <span className="font-medium text-gray-900 dark:text-white">
              Último login:
            </span>{" "}
            {formattedLoginDate}
          </span>
        </div>
      </div>
    </div>
  );
}
