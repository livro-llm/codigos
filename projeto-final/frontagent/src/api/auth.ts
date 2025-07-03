import api from "@/api/api";

export async function googleLogin(id_token: string) {
  const res = await api.post("/auth/google", { id_token });
  return res.data; // retorna access_token e refresh_token
}
