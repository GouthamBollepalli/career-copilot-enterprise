import React from "react";
export function Button({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`px-4 py-2 rounded bg-black text-white disabled:opacity-50 ${className}`} {...props}>{children}</button>;
}
