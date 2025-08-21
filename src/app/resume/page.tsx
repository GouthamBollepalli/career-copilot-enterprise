"use client";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { supabaseClient } from "@config/supabaseClient";

const AtsSchema = z.object({ score: z.number(), missing: z.array(z.string()), explanations: z.array(z.string()) });
const OptimizeSchema = z.object({ optimizedResume: z.string(), ats: AtsSchema });
type OptimizeResult = z.infer<typeof OptimizeSchema>;
type AtsOnly = z.infer<typeof AtsSchema>;

export default function ResumePage() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [out, setOut] = useState<OptimizeResult | null>(null);
  const [ats, setAts] = useState<AtsOnly | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) => setToken(data.session?.access_token ?? null));
    const { data: sub } = supabaseClient.auth.onAuthStateChange((_evt, session) => setToken(session?.access_token ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!resume || !jd || !token) { setAts(null); return; }
    const t = setTimeout(async () => {
      try {
        abortRef.current?.abort();
        const ctl = new AbortController();
        abortRef.current = ctl;
        const res = await fetch("/api/resume/score", {
          method: "POST",
          headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
          body: JSON.stringify({ resume, jobDescription: jd }),
          signal: ctl.signal
        });
        const json = await res.json();
        const parsed = AtsSchema.safeParse(json);
        if (parsed.success) setAts(parsed.data);
        else setAts(null);
      } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [resume, jd, token]);

  const optimize = async () => {
    if (!token) return alert("Please sign in first.");
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/resume/optimize", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ rawResume: resume, jobDescription: jd })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Request failed");
      const parsed = OptimizeSchema.safeParse(json);
      if (!parsed.success) throw new Error("Unexpected response");
      setOut(parsed.data);
    } catch (e) {
      setOut(null);
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">AI Resume Optimizer</h1>
      {!token && <div className="p-3 rounded bg-yellow-50 border text-sm">Please sign in to use the optimizer.</div>}
      <textarea className="w-full border rounded p-2 h-40" placeholder="Paste your resume" value={resume} onChange={e=>setResume(e.target.value)} />
      <textarea className="w-full border rounded p-2 h-40" placeholder="Paste the job description" value={jd} onChange={e=>setJd(e.target.value)} />

      {ats && (
        <div className="rounded border p-3 bg-gray-50">
          <div className="font-medium">Live ATS Score: {ats.score}</div>
          <div className="text-xs text-gray-600 mt-1">{ats.explanations[0]}</div>
          <div className="mt-2 flex flex-wrap gap-2">{ats.missing.slice(0,20).map(w => <span key={w} className="px-2 py-1 text-xs rounded border bg-white">{w}</span>)}</div>
        </div>
      )}

      <button onClick={optimize} disabled={loading} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
        {loading ? "Optimizing..." : "Optimize"}
      </button>

      {error && <div className="border rounded p-3 bg-red-50 text-red-700">{error}</div>}

      {out && (
        <div className="border rounded p-3 bg-gray-50">
          <div className="font-medium mb-2">Final ATS Score: {out.ats.score}</div>
          <div className="text-sm mb-2">Missing: {out.ats.missing.slice(0,10).join(", ")}</div>
          <pre className="whitespace-pre-wrap text-sm">{out.optimizedResume}</pre>
        </div>
      )}
    </div>
  );
}
