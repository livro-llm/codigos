const BASE_URL = "http://localhost:5000";

export async function googleLogin(id_token: string) {
  const response = await fetch(`${BASE_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_token }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.msg || "Erro na autenticação");
  }

  return response.json();
}
