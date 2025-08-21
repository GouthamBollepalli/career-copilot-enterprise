"use client";
import { useEffect, useState } from "react";
import { supabaseClient } from "@config/supabaseClient";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => { supabaseClient.auth.getSession().then(({ data }) => setToken(data.session?.access_token ?? null)); }, []);
  const checkout = async () => {
    setLoading(true);
    const res = await fetch("/api/billing/checkout", { method: "POST", headers: token ? { authorization: `Bearer ${token}` } : undefined });
    const json = await res.json();
    setLoading(false);
    if (json?.url) window.location.href = json.url;
    else alert(json?.error ?? "Failed to start checkout");
  };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Pricing</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded p-4 bg-white">
          <h2 className="font-medium">Free</h2>
          <ul className="text-sm text-gray-600 list-disc pl-5 mt-2">
            <li>3 optimizations/day</li>
            <li>Basic ATS score</li>
          </ul>
        </div>
        <div className="border rounded p-4 bg-white">
          <h2 className="font-medium">Pro — $19/mo</h2>
          <ul className="text-sm text-gray-600 list-disc pl-5 mt-2">
            <li>Unlimited optimizations</li>
            <li>Interview feedback</li>
          </ul>
          <button onClick={checkout} disabled={loading} className="mt-3 px-4 py-2 bg-black text-white rounded">
            {loading ? "Redirecting..." : "Upgrade"}
          </button>
        </div>
      </div>
    </div>
  );
}
