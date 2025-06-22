import MainLayout from "@/layouts/MainLayout";
import ChatArea from "@/components/ChatArea";

const Home: React.FC = () => (
  <MainLayout>
    <main className="flex flex-col flex-grow h-full">
      <ChatArea />
    </main>
  </MainLayout>
);

export default Home;
