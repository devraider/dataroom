import type { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />

      <main className="flex-1 w-full px-4 py-8">{children}</main>
    </div>
  );
}
