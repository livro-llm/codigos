import { motion } from "framer-motion";
import Login from "@/components/Login/Login";

export default function LoginScreen() {
  return (
    <div className="flex h-screen w-full">
      <div
        className="flex w-full md:w-1/2 flex-col items-center justify-center h-full
                      bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700
                      px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-sm w-full p-10 rounded-2xl shadow-lg
                     bg-gray-900 bg-opacity-80 border border-gray-700
                     mx-auto text-center"
        >
          <div className="flex justify-center mb-8">
            <img src="/login.svg" alt="Login Icon" className="h-24 md:h-32" />
          </div>
          <p className="mb-6 text-xl font-semibold text-gray-200 drop-shadow-sm">
            Entre no seu espaço de cuidado e bem-estar. Lina está pronta para
            ouvir você.
          </p>
          <hr className="mb-8 border-gray-700" />
          <Login />
        </motion.div>
      </div>

      <div className="hidden md:flex w-1/2 bg-gradient-to-tr from-blue-400 via-blue-300 to-indigo-400 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-md px-8"
        >
          <img src="/lina.png" alt="Bem-vindo" className="w-4/5 mx-auto mb-6" />
          <h2 className="text-4xl font-extrabold text-white mb-3 drop-shadow-lg">
            Bem-vindo ao Lina
          </h2>
          <p className="text-white text-lg drop-shadow-md">
            Lina é sua companheira digital, desenvolvida para oferecer apoio
            emocional, acolhimento e ferramentas práticas para o seu bem-estar.
            sentimentos.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
