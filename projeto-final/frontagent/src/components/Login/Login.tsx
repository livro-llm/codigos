import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/stores/Auth/useAuthStore";
import { googleLogin } from "@/api/auth";
import { LoginDropdown } from "@/components/Login/LoginDropdown";

function Login() {
  const { user, setUser } = useAuthStore();

  const handleLoginSuccess = async (cr: any) => {
    const credential = cr.credential;

    try {
      const decoded: any = jwtDecode(credential);
      const data = await googleLogin(credential);

      setUser(
        {
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
        },
        data.access_token,
        data.refresh_token
      );
    } catch (err) {
      console.error("❌ Erro ao logar com Google:", err);
    }
  };

  return (
    <div className="border-t dark:border-gray-700 p-4">
      {user ? (
        <LoginDropdown />
      ) : (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => console.log("Login Failed")}
        />
      )}
    </div>
  );
}

export default Login;
