import { Folder } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 w-full">
        <div className="flex items-center gap-2">
          <Folder className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Data Room</h1>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && <UserMenu user={user} onLogout={handleLogout} />}
        </div>
      </div>
    </header>
  );
}
