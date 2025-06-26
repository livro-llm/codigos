import { LoginDropdown } from "./LoginDropdown";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/stores/useAuthStore";

function Login() {
  const { user, setUser } = useAuthStore();

  const handleLoginSuccess = (cr: any) => {
    const decoded: any = jwtDecode(cr.credential);
    setUser({
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
    });
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
