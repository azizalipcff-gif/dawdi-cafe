"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ADMIN_PATH } from "@/lib/constants";

export function AdminLoginClient() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const form = new FormData(e.currentTarget);
      const email = String(form.get("email") ?? "");
      const password = String(form.get("password") ?? "");
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("Sign-in failed", error);
        return;
      }
      router.push(ADMIN_PATH);
      router.refresh();
    });
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden p-6">
      {/* Ambient glass background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-2xl shadow-black/50 px-8 py-12">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/10 border border-white/10 p-1.5">
                <Image
                  src="/logo/logo.png"
                  alt="DAWDI CAFE"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="font-display text-2xl font-bold text-white tracking-tight"
            >
              Admin Panel
            </motion.h1>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 w-full space-y-4"
            >
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="Email"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-[15px] text-white placeholder:text-zinc-500 outline-none focus:border-brand/60 transition-colors"
              />
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="Password"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-[15px] text-white placeholder:text-zinc-500 outline-none focus:border-brand/60 transition-colors"
              />
              <button
                type="submit"
                disabled={pending}
                className="group relative w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-[15px] font-medium text-zinc-800 shadow-lg shadow-black/30 transition-all duration-300 hover:shadow-xl hover:shadow-black/40 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
              >
                {pending ? "Signing in..." : "Sign in"}
              </button>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
