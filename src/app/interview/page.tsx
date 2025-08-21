"use client";
import { useEffect, useState } from "react";
import { supabaseClient } from "@config/supabaseClient";

export default function InterviewPage() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) => setToken(data.session?.access_token ?? null));
    const { data: sub } = supabaseClient.auth.onAuthStateChange((_evt, session) => setToken(session?.access_token ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const generate = async () => {
    if (!token) return alert("Sign in first.");
    setLoading(true);
    const res = await fetch("/api/interview/generate", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ resume, jobDescription: jd })
    });
    const json = await res.json();
    setQuestions(json.questions ?? []);
    setIdx(0);
    setFeedback(null);
    setLoading(false);
  };

  const evaluate = async () => {
    if (!token) return alert("Sign in first.");
    setLoading(true);
    const res = await fetch("/api/interview/feedback", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ resume, jobDescription: jd, question: questions[idx], answer })
    });
    const json = await res.json();
    if (!res.ok) alert(json?.error ?? "Feedback requires Pro");
    setFeedback(json.feedback ?? "No feedback");
    setLoading(false);
  };

  const nextQ = () => { setIdx(i => Math.min(i + 1, questions.length - 1)); setAnswer(""); setFeedback(null); };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">AI Interview Coach</h1>
      {!token && <div className="p-3 rounded bg-yellow-50 border text-sm">Please sign in to use the Interview coach.</div>}
      <textarea className="w-full border rounded p-2 h-32" placeholder="Paste your resume" value={resume} onChange={e=>setResume(e.target.value)} />
      <textarea className="w-full border rounded p-2 h-32" placeholder="Paste job description" value={jd} onChange={e=>setJd(e.target.value)} />
      <button onClick={generate} disabled={loading} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
        {loading ? "Generating..." : "Generate Questions"}
      </button>

      {questions.length > 0 && (
        <div className="border rounded p-3 bg-gray-50 space-y-3">
          <div className="text-sm text-gray-600">Question {idx + 1} / {questions.length}</div>
          <div className="font-medium">{questions[idx]}</div>
          <textarea className="w-full border rounded p-2 h-28" placeholder="Type your answer..." value={answer} onChange={e=>setAnswer(e.target.value)} />
          <div className="flex gap-2">
            <button onClick={evaluate} disabled={loading} className="px-3 py-1 rounded border bg-white">Get Feedback (Pro)</button>
            <button onClick={nextQ} className="px-3 py-1 rounded border bg-white">Next Question</button>
          </div>
          {feedback && <div className="text-sm bg-white border rounded p-2">{feedback}</div>}
        </div>
      )}
    </div>
  );
}
