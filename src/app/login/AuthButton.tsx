"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseClient } from "@config/supabaseClient";

export default function AuthButton() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) => setEmail(data.session?.user?.email ?? null));
    const { data: sub } = supabaseClient.auth.onAuthStateChange((_evt, session) => setEmail(session?.user?.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);
  if (!email) return <Link className="px-4 py-2 rounded border bg-white" href="/login">Sign in</Link>;
  const signOut = async () => { await supabaseClient.auth.signOut(); };
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">{email}</span>
      <button onClick={signOut} className="px-3 py-1 rounded border bg-white text-sm">Sign out</button>
    </div>
  );
}
