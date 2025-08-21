"use client";
import { useState } from "react";
import { supabaseClient } from "@config/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const magic = async () => {
    setLoading(true);
    setMsg(null);
    const { error } = await supabaseClient.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    setLoading(false);
    setMsg(error ? error.message : "Check your inbox for a login link.");
  };

  const google = async () => {
    setLoading(true);
    const { error } = await supabaseClient.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
    setLoading(false);
    if (error) alert(error.message);
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <input className="w-full border rounded p-2" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
      <button onClick={magic} disabled={loading} className="px-4 py-2 rounded bg-black text-white w-full">{loading ? "Sending..." : "Email magic link"}</button>
      <div className="text-center text-sm text-gray-500">or</div>
      <button onClick={google} disabled={loading} className="px-4 py-2 rounded border bg-white w-full">Continue with Google</button>
      {msg && <div className="text-sm text-gray-600">{msg}</div>}
    </div>
  );
}
