"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/admin/dashboard");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin() {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <div className="font-body bg-paper text-ink antialiased min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-tight-display block mb-16"
        >
          Komply<span className="text-clay">.</span>
        </Link>

        <div className="mb-10">
          <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-3">
            Admin access
          </p>
          <h1 className="font-display text-[2.5rem] font-semibold leading-[0.92] tracking-tight-display">
            Sign in.
          </h1>
        </div>

        {error && (
          <div className="mb-6 border border-clay/30 px-4 py-3">
            <p className="font-body text-sm font-light text-clay">{error}</p>
          </div>
        )}

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-light tracking-[0.2em] uppercase text-ash block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@komply.co"
              className="w-full bg-transparent border border-rule px-4 py-3 text-sm font-light font-body text-ink transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-light tracking-[0.2em] uppercase text-ash block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              className="w-full bg-transparent border border-rule px-4 py-3 text-sm font-light font-body text-ink transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-ink text-paper text-sm font-light px-8 py-4 hover:bg-clay transition-colors duration-300 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </div>

        <p className="text-[11px] font-light tracking-loose-body text-ash mt-10">
          This area is restricted to Komply administrators only.
        </p>
      </div>
    </div>
  );
}
