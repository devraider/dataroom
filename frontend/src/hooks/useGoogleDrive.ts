import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { CONFIG } from "@/lib/config";

export const useGoogleDrive = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Google OAuth login
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      setError(null);
      setIsLoading(false);
    },
    onError: () => {
      setError("Failed to authenticate with Google");
      setIsLoading(false);
    },
    scope: CONFIG.GOOGLE_DRIVE_SCOPE,
  });

  // Authenticate with Google
  const authenticate = () => {
    setIsLoading(true);
    setError(null);
    googleLogin();
  };

  return {
    isAuthenticated: !!accessToken,
    accessToken,
    isLoading,
    error,
    authenticate,
  };
};
