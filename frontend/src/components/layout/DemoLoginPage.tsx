import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/authService";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

export default function DemoLoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleDemoLogin = async () => {
    try {
      const { user, token } = await authService.googleLogin("demo-credential");

      setAuth(user, token);

      toast.success("Demo login successful", {
        description: `Welcome, ${user.name}!`,
      });

      navigate("/workspaces");
    } catch {
      toast.error("Login failed", {
        description: "Demo login failed",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Data Room</CardTitle>
          <CardDescription className="text-base mt-2">
            Demo Mode - Quick access to explore features
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Button onClick={handleDemoLogin} className="w-full" size="lg">
            Continue with Demo Login
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            No authentication required - Click to explore the app
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
