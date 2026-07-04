"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Clicking the emailed link redirects here with a recovery token in the
    // URL, which the Supabase client exchanges for a session automatically.
    // We wait for that session before showing the form — otherwise a direct
    // visit to this URL (no valid token) would show a form that can't work.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit() {
    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // Sign out so they log back in fresh with the new password, rather than
    // silently staying signed in on the recovery session.
    await supabase.auth.signOut();
    setTimeout(() => router.push("/admin/login"), 2000);
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
            Set new password.
          </h1>
        </div>

        {!ready && !success && (
          <p className="font-body text-sm font-light text-ash">
            Verifying your reset link...
          </p>
        )}

        {ready && !success && (
          <>
            {error && (
              <div className="mb-6 border border-clay/30 px-4 py-3">
                <p className="font-body text-sm font-light text-clay">
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-light tracking-[0.2em] uppercase text-ash block">
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full bg-transparent border border-rule px-4 py-3 text-sm font-light font-body text-ink transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-light tracking-[0.2em] uppercase text-ash block">
                  Confirm new password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Re-enter password"
                  className="w-full bg-transparent border border-rule px-4 py-3 text-sm font-light font-body text-ink transition-colors"
                />
              </div>
              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-ink text-paper text-sm font-light px-8 py-4 hover:bg-clay transition-colors duration-300 disabled:opacity-60"
                >
                  {loading ? "Updating..." : "Update password"}
                </button>
              </div>
            </div>
          </>
        )}

        {success && (
          <div className="border border-rule px-4 py-3">
            <p className="font-body text-sm font-light text-ink">
              Password updated. Redirecting you to sign in...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
