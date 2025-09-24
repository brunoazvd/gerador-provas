import type { ReactNode } from "react";

export const PageWrapper = ({ children }: { children: ReactNode }) => {
  return <div className="min-h-svh">{children}</div>;
};
