import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AuthError } from "@/lib/auth/errors";
import { useToast } from "@/components/Toast";
import PageLoading from "@/components/PageLoading";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { showToast } = useToast();
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      showToast({
        id: "auth-error",
        mode: "error",
        message: "Please enter your username and password.",
      });

      return;
    }

    try {
      await login({ username, password });
      navigate("/", { replace: true });
    } catch (error: unknown) {
      if (error instanceof AuthError) {
        showToast({ id: "auth-error", mode: "error", message: error.message });
      } else {
        throw error;
      }
    }
  };

  return (
    <div className="w-full h-full flex justify-center p-1">
      {isLoading ? (
        <PageLoading />
      ) : (
        <div className="w-full max-w-md mt-20 md:mt-30">
          <h1 className="text-4xl font-bold text-fg">Hello</h1>

          <form onSubmit={handleSubmit} className="space-y-4 mt-8">
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-bg-hard h-14 text-lg md:text-xl rounded-md py-3 px-4 focus:outline-none"
            />

            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-hard h-14 text-lg md:text-xl rounded-md py-3 px-4 focus:outline-none"
            />

            <button
              type="submit"
              className="w-full h-14 items-center justify-center text-2xl font-bold bg-accent-orange hover:opacity-90 transition-opacity rounded-md shadow-md cursor-pointer"
            >
              Sign In
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
