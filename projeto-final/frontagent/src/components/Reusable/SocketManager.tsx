// src/components/SocketManager.tsx
import { useEffect } from "react";
import { useAuthStore } from "@/stores/Auth/useAuthStore";
import { useChatStore } from "@/stores/Chat/useChatStore";

export function SocketManager() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const connect = useChatStore((state) => state.connect);
  const disconnect = useChatStore((state) => state.disconnect);

  useEffect(() => {
    disconnect();
    connect();
  }, [accessToken, connect, disconnect]);

  return null;
}
