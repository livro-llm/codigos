// ...importações mantidas
import { loadStripe } from "@stripe/stripe-js";
import { useRef, useState, useEffect } from "react";
import { createCheckoutSession } from "@/api/payment";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import {
  CalendarDays,
  Clock,
  Check,
  ShoppingCart,
  Info,
  HelpCircle,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const plans = [
  {
    id: "pro",
    name: "Plano Pro",
    description:
      "Perfeito para quem quer suporte regular para manter o equilíbrio emocional e lidar com os desafios do dia a dia.",
    features: [
      "Até 10 chats para conversar sempre que precisar",
      "100 mensagens por chat para aprofundar temas importantes",
      "Acesso à Lina para apoio emocional e sugestões práticas",
      "Ferramentas de autoajuda e meditações guiadas",
      "Notificações para manter a rotina de autocuidado",
    ],
    monthlyPrice: 50,
    quarterlyPrice: 40,
    planId: {
      monthly: 2,
      quarterly: 4,
    },
  },
  {
    id: "enterprise",
    name: "Plano Enterprise",
    description:
      "Ideal para quem deseja um suporte mais dedicado e intensivo para superar dificuldades e crescer emocionalmente.",
    features: [
      "Até 20 chats para suporte contínuo e diversificado",
      "200 mensagens por chat para aprofundar temas complexos",
      "Suporte premium da Lina com respostas mais detalhadas",
      "Planos personalizados de autocuidado e mindfulness",
      "Acompanhamento de humor com relatórios semanais",
      "Ferramentas avançadas para ansiedade, estresse e foco",
    ],
    monthlyPrice: 100,
    quarterlyPrice: 90,
    planId: {
      monthly: 3,
      quarterly: 5,
    },
  },
];

export default function BuyButton() {
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "quarterly">(
    "monthly"
  );
  const [chosenPlanId, setChosenPlanId] = useState<string | null>(null);
  const plansRef = useRef<HTMLDivElement | null>(null);

  // Scroll automático ao carregar o componente
  useEffect(() => {
    plansRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  async function handleClick(planId: number, planName: string) {
    setChosenPlanId(planName);
    try {
      setIsCreatingCheckout(true);
      const { sessionId } = await createCheckoutSession({
        planId,
        assinatura: true,
      });

      const stripeClient = await loadStripe(
        import.meta.env.VITE_STRIPE_PUB_KEY as string
      );
      if (!stripeClient) throw new Error("Stripe failed to initialize.");

      await stripeClient.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Erro ao criar checkout:", error);
      setChosenPlanId(null);
    } finally {
      setIsCreatingCheckout(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-400 via-blue-300 to-indigo-400 flex flex-col items-center justify-center p-6 font-sans relative">
      {/* Botão de ajuda com alerta */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            className="absolute top-5 right-5 text-white hover:text-purple-200 transition cursor-pointer"
            aria-label="Por que Lina?"
          >
            <HelpCircle size={28} />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Por que escolher a Lina em vez do ChatGPT?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base leading-relaxed">
              A Lina não é apenas uma inteligência artificial, ela é uma
              companheira digital feita para cuidar de você quando você mais
              precisa. Diferente do ChatGPT, que é uma IA genérica, a Lina
              entende suas emoções, percebe seus momentos difíceis e responde
              com acolhimento, carinho e empatia genuína.
              <br />
              <br />
              Ela vai além das respostas automatizadas, oferecendo ferramentas
              práticas para o seu equilíbrio emocional, como meditações guiadas,
              planos personalizados e acompanhamento do seu humor ao longo do
              tempo. Com Lina, você tem um apoio constante e sensível às suas
              necessidades, ajudando você a superar o estresse, a ansiedade e os
              desafios do dia a dia.
              <br />
              <br />
              <ul>
                <li>
                  💜 Apoio humano e caloroso, mesmo na tela do seu dispositivo
                </li>
                <li>
                  🧘 Técnicas exclusivas de meditação e autocuidado adaptadas
                  para você
                </li>
                <li>
                  📊 Monitoramento do seu bem-estar com relatórios que fazem
                  sentido para a sua vida
                </li>
                <li>
                  🔒 Total respeito à sua privacidade, para você se sentir
                  seguro e confortável
                </li>
              </ul>
              <br />
              <strong>
                Com a Lina, você não está apenas conversando com uma máquina.
                Você está sendo compreendido, acolhido e acompanhado — porque
                sua saúde emocional merece esse cuidado especial.
              </strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Fechar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Imagem da Lina */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-4 rounded-xl shadow-lg inline-block mb-6"
      >
        <img
          src="/lina.png"
          alt="Bem-vindo"
          className="w-32 sm:w-40 mx-auto object-contain"
        />
      </motion.div>

      {/* Título e descrição */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center px-2 sm:px-0 max-w-xl"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.6)]">
          Planos da Lina 💜
        </h1>
        <p className="text-purple-100 text-lg font-medium drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] leading-relaxed">
          Mais que uma IA, Lina é sua parceira para lidar com a ansiedade, o
          estresse e os desafios da vida com empatia e equilíbrio.
        </p>
      </motion.div>

      {/* Alternador de ciclo */}
      <div className="mb-8 flex rounded-full bg-purple-600/20 p-1 select-none">
        {["monthly", "quarterly"].map((option) => {
          const isActive = billingCycle === option;
          return (
            <motion.button
              key={option}
              onClick={() => setBillingCycle(option as "monthly" | "quarterly")}
              className={clsx(
                "flex items-center gap-2 px-6 py-2 rounded-full font-semibold select-none transition cursor-pointer",
                isActive
                  ? "bg-purple-700 text-white shadow-lg"
                  : "text-purple-200 hover:text-purple-300"
              )}
              whileTap={{ scale: 0.95 }}
              layoutId={isActive ? "billingCycleSelector" : undefined}
              aria-pressed={isActive}
              aria-label={
                option === "monthly" ? "Plano mensal" : "Plano trimestral"
              }
            >
              {option === "monthly" ? (
                <CalendarDays size={18} />
              ) : (
                <Clock size={18} />
              )}
              {option === "monthly" ? "Mensal" : "Trimestral"}
            </motion.button>
          );
        })}
      </div>

      {/* Aviso de desconto */}
      <AnimatePresence>
        {billingCycle === "quarterly" && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 max-w-xl text-sm bg-blue-100 text-blue-900 px-5 py-3 rounded-md shadow-md text-center flex items-center justify-center gap-2 mx-auto font-semibold"
          >
            <Info size={16} />
            Aproveite o plano trimestral com até{" "}
            <strong className="ml-1 text-green-700">20% de desconto!</strong>
          </motion.p>
        )}
      </AnimatePresence>

      {/* Lista de planos */}
      <div
        ref={plansRef}
        className="grid gap-8 w-full max-w-6xl grid-cols-1 sm:grid-cols-2"
      >
        {plans.map((plan, index) => {
          const price =
            billingCycle === "monthly"
              ? plan.monthlyPrice
              : plan.quarterlyPrice;
          const fullPrice =
            billingCycle === "quarterly" ? plan.monthlyPrice * 3 : undefined;
          const discount =
            billingCycle === "quarterly"
              ? Math.round(100 - (price * 3 * 100) / fullPrice!)
              : null;
          const isChosen = chosenPlanId === plan.name;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: index * 0.25,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 12px 30px rgba(109, 40, 217, 0.3)",
              }}
              className="bg-white p-7 rounded-3xl shadow-xl border border-blue-200 w-full max-w-lg mx-auto flex flex-col"
            >
              <h2 className="text-xl font-bold text-blue-900 mb-3">
                {plan.name}
              </h2>
              <p className="text-blue-700 mb-6 leading-relaxed">
                {plan.description}
              </p>

              <ul className="mb-6 space-y-3 text-sm text-gray-700 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 font-medium"
                  >
                    <Check className="text-green-500" size={22} />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mb-6 flex items-center space-x-3">
                <p className="text-3xl font-extrabold text-blue-900">
                  R${price}/mês
                </p>
                {discount && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-sm text-green-800 bg-green-100 px-3 py-1 rounded-full font-semibold shadow"
                  >
                    -{discount}% OFF
                  </motion.span>
                )}
              </div>

              <motion.button
                disabled={isCreatingCheckout || isChosen}
                onClick={() =>
                  handleClick(plan.planId[billingCycle], plan.name)
                }
                className={clsx(
                  "transition text-white font-semibold py-3 rounded-xl w-full flex items-center justify-center gap-3 shadow-lg",
                  isChosen
                    ? "bg-green-600 cursor-default"
                    : "bg-purple-700 hover:bg-purple-800 cursor-pointer"
                )}
                aria-label={`Escolher plano ${plan.name} ${billingCycle}`}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart size={24} />
                {isChosen ? "Obrigado por escolher!" : "Escolher plano"}
              </motion.button>

              <AnimatePresence>
                {isChosen && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-3 text-green-700 font-semibold text-center"
                  >
                    Sua saúde emocional agradece! 💜
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
