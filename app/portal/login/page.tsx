"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type View = "login" | "signup" | "reset";

export default function PortalLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [view, setView] = useState<View>("login");

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  // Reset state
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/portal/dashboard");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin() {
    if (!email || !password) {
      setLoginError("Please enter your email and password.");
      return;
    }
    setLoginLoading(true);
    setLoginError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError(error.message);
      setLoginLoading(false);
      return;
    }

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("email", email)
      .single();

    if (!client) {
      await supabase.auth.signOut();
      setLoginError(
        "No client account found for this email. Contact your Komply analyst.",
      );
      setLoginLoading(false);
      return;
    }

    router.push("/portal/dashboard");
  }

  async function handleSignup() {
    if (!signupEmail || !signupPassword) {
      setSignupError("Please enter your email and password.");
      return;
    }
    if (signupPassword.length < 8) {
      setSignupError("Password must be at least 8 characters.");
      return;
    }

    setSignupLoading(true);
    setSignupError("");

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("email", signupEmail)
      .single();

    if (!client) {
      setSignupError(
        "No client account found for this email. Contact your Komply analyst.",
      );
      setSignupLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
    });

    if (error) {
      setSignupError(error.message);
      setSignupLoading(false);
      return;
    }

    await supabase
      .from("clients")
      .update({ user_id: data.user?.id, invite_status: "active" })
      .eq("email", signupEmail);

    setSignupSuccess(true);
    setSignupLoading(false);
    setTimeout(() => router.push("/portal/dashboard"), 2000);
  }

  async function handleReset() {
    if (!resetEmail) return;
    await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/portal/login`,
    });
    setResetSuccess(true);
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

        {view === "login" && (
          <div>
            <div className="mb-10">
              <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-3">
                Client portal
              </p>
              <h1 className="font-display text-[2.5rem] font-semibold leading-[0.92] tracking-tight-display">
                Sign in.
              </h1>
            </div>

            {loginError && (
              <div className="mb-6 border border-clay/30 px-4 py-3">
                <p className="font-body text-sm font-light text-clay">
                  {loginError}
                </p>
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
                  placeholder="you@company.com"
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
              <div className="pt-2 space-y-3">
                <button
                  onClick={handleLogin}
                  disabled={loginLoading}
                  className="w-full bg-ink text-paper text-sm font-light px-8 py-4 hover:bg-clay transition-colors duration-300 disabled:opacity-60"
                >
                  {loginLoading ? "Signing in..." : "Sign in"}
                </button>
                <button
                  onClick={() => setView("signup")}
                  className="w-full border border-rule text-sm font-light px-8 py-4 text-ash hover:border-ash transition-colors"
                >
                  First time? Create password
                </button>
              </div>
            </div>

            <button
              onClick={() => setView("reset")}
              className="text-[11px] font-light tracking-loose-body text-ash hover:text-ink transition-colors mt-8 block"
            >
              Forgot password?
            </button>
          </div>
        )}

        {view === "signup" && (
          <div>
            <div className="mb-10">
              <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-3">
                First time
              </p>
              <h1 className="font-display text-[2.5rem] font-semibold leading-[0.92] tracking-tight-display">
                Create password.
              </h1>
              <p className="font-body text-sm font-light text-ash mt-3 leading-relaxed">
                Enter the email Komply used to contact you and set your
                password.
              </p>
            </div>

            {signupError && (
              <div className="mb-6 border border-clay/30 px-4 py-3">
                <p className="font-body text-sm font-light text-clay">
                  {signupError}
                </p>
              </div>
            )}
            {signupSuccess && (
              <div className="mb-6 border border-rule px-4 py-3">
                <p className="font-body text-sm font-light text-ink">
                  Account created. You can now sign in.
                </p>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-light tracking-[0.2em] uppercase text-ash block">
                  Email
                </label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-transparent border border-rule px-4 py-3 text-sm font-light font-body text-ink transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-light tracking-[0.2em] uppercase text-ash block">
                  New password
                </label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full bg-transparent border border-rule px-4 py-3 text-sm font-light font-body text-ink transition-colors"
                />
              </div>
              <div className="pt-2">
                <button
                  onClick={handleSignup}
                  disabled={signupLoading}
                  className="w-full bg-ink text-paper text-sm font-light px-8 py-4 hover:bg-clay transition-colors duration-300 disabled:opacity-60"
                >
                  {signupLoading ? "Creating account..." : "Create account"}
                </button>
              </div>
            </div>

            <button
              onClick={() => setView("login")}
              className="text-[11px] font-light tracking-loose-body text-ash hover:text-ink transition-colors mt-8 block"
            >
              ← Back to sign in
            </button>
          </div>
        )}

        {view === "reset" && (
          <div>
            <div className="mb-10">
              <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-3">
                Reset password
              </p>
              <h1 className="font-display text-[2.5rem] font-semibold leading-[0.92] tracking-tight-display">
                Forgot password.
              </h1>
              <p className="font-body text-sm font-light text-ash mt-3 leading-relaxed">
                Enter your email and we&apos;ll send a reset link.
              </p>
            </div>

            {resetSuccess && (
              <div className="mb-6 border border-rule px-4 py-3">
                <p className="font-body text-sm font-light text-ink">
                  Reset link sent. Check your inbox.
                </p>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-light tracking-[0.2em] uppercase text-ash block">
                  Email
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-transparent border border-rule px-4 py-3 text-sm font-light font-body text-ink transition-colors"
                />
              </div>
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="w-full bg-ink text-paper text-sm font-light px-8 py-4 hover:bg-clay transition-colors duration-300"
                >
                  Send reset link
                </button>
              </div>
            </div>

            <button
              onClick={() => setView("login")}
              className="text-[11px] font-light tracking-loose-body text-ash hover:text-ink transition-colors mt-8 block"
            >
              ← Back to sign in
            </button>
          </div>
        )}

        <p className="text-[11px] font-light tracking-loose-body text-ash mt-12">
          Not a Komply client yet?{" "}
          <Link
            href="/contact"
            className="border-b border-ash/40 hover:text-ink hover:border-ink transition-colors"
          >
            Request access →
          </Link>
        </p>
      </div>
    </div>
  );
}
