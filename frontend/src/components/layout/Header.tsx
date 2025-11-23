import { Folder, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import { UserRole } from "@/types/auth";

export default function Header() {
  const user = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: UserRole.ADMIN,
    picture:
      "https://ui-avatars.com/api/?name=John+Doe&background=4F46E5&color=fff",
  };
  const handleLogout = () => {
    // Implement logout functionality here
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
          <UserMenu user={user} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}
