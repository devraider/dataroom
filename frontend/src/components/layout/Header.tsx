import { Folder } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import { useAuthStore } from "@/store/authStore";
import { useLocation, useNavigate } from "react-router-dom";
import { useWorkspaceStore } from "@/store/workspaceStore";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const isInWorkspace = location.pathname.includes("/files");
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 w-full">
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/workspaces")}>
            <Folder className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Data Room</h1>
          </div>

          {isInWorkspace && currentWorkspace && (
            <>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Workspace:
                </span>
                <span className="font-medium">{currentWorkspace.name}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && <UserMenu user={user} onLogout={handleLogout} />}
        </div>
      </div>
    </header>
  );
}
