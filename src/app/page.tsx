import Link from "next/link";
import { Card } from "@ui/Card";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Get hired faster with AI</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Tailor your resume to any job, get live ATS feedback, and practice interviews with an AI coach.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/resume" className="px-5 py-2 rounded bg-black text-white">Try Resume Optimizer</Link>
          <Link href="/pricing" className="px-5 py-2 rounded border bg-white">Upgrade to Pro</Link>
        </div>
      </section>
      <section className="grid md:grid-cols-3 gap-6">
        <Card><h3 className="font-medium mb-2">Live ATS Scoring</h3><p className="text-sm text-gray-600">See missing keywords and fix them instantly.</p></Card>
        <Card><h3 className="font-medium mb-2">Interview Coach</h3><p className="text-sm text-gray-600">Role-specific questions & STAR feedback.</p></Card>
        <Card><h3 className="font-medium mb-2">Simple Billing</h3><p className="text-sm text-gray-600">Upgrade in one click with Stripe Checkout.</p></Card>
      </section>
    </div>
  );
}
