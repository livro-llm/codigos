import MainLayout from "@/layouts/MainLayout";
import BuyButton from "@/components/Buy/BuyButton";

const Buy: React.FC = () => (
  <MainLayout>
    <main className="flex flex-col flex-grow min-h-screen overflow-y-auto ">
      <BuyButton />
    </main>
  </MainLayout>
);

export default Buy;
