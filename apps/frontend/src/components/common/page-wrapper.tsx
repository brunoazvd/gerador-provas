import type { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
export const PageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-svh flex flex-col">
      <div className="flex flex-col h-full">
        <Navbar />
        <main className="py-12 flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
};
