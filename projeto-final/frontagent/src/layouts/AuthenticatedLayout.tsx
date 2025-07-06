import { useSidebarStore } from "@/stores/Sidebar/useSidebarStore";
import Sidebar from "@/components/Sidebar/Sidebar";
import MobileHeader from "./MobileHeader";
import { SocketManager } from "@/components/Reusable/SocketManager";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, setOpen } = useSidebarStore();

  return (
    <>
      <Sidebar />

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex flex-col h-screen w-full md:ml-0">
        <MobileHeader />
        <SocketManager />
        <main className="flex-grow overflow-y-auto">{children}</main>
      </div>
    </>
  );
}
