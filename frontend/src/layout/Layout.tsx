import type { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
