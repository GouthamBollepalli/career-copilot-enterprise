import React from "react";
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`border rounded bg-white p-4 shadow-sm ${className}`}>{children}</div>;
}
