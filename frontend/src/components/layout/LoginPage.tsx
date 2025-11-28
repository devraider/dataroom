import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/authService";
import { CONFIG } from "../../lib/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSuccess = async (credentialResponse: { credential?: string }) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received");
      }

      const { user, token } = await authService.googleLogin(
        credentialResponse.credential
      );

      setAuth(user, token);

      toast.success("Login successful", {
        description: `Welcome back, ${user.name}!`,
      });

      navigate("/workspaces");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error("Login failed", {
        description:
          err.response?.data?.message || "Failed to authenticate with Google",
      });
    }
  };

  const handleError = () => {
    toast.error("Login failed", {
      description: "Google authentication failed. Please try again.",
    });
  };

  return (
    <GoogleOAuthProvider clientId={CONFIG.GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Data Room</CardTitle>
            <CardDescription className="text-base mt-2">
              Sign in with your Google account to access your workspaces
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap
                theme="outline"
                size="large"
                text="signin_with"
                width="300"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Sign in to access your workspaces and manage your files securely.
            </p>
          </CardContent>
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
}
