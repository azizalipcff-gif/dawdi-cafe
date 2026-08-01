"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { loginAdmin, type LoginState } from "@/lib/actions/auth";
import { useI18n } from "@/lib/i18n/LocaleProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ADMIN_RESET_PATH } from "@/lib/constants";
import { SITE_NAME } from "@/lib/constants";

interface AdminLoginClientProps {
  next?: string;
  reset?: boolean;
  denied?: boolean;
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full gap-2">
      <Lock className="w-4 h-4" />
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function AdminLoginClient({ next, reset, denied }: AdminLoginClientProps) {
  const { dict } = useI18n();
  const [state, setState] = useState<LoginState>({});
  const t = dict.admin.login;

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand/10 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <Image src="/logo/logo.png" alt={SITE_NAME} fill className="object-contain" sizes="80px" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">{t.title}</h1>
          <p className="text-gray-400 mt-2 text-sm">{t.subtitle.replace("{name}", SITE_NAME)}</p>
        </div>

        <form
          action={async (formData) => setState(await loginAdmin(state, formData))}
          className="glass rounded-2xl p-8 space-y-5"
        >
          {reset && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {t.resetBanner}
            </motion.div>
          )}

          {denied && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {t.accessDenied}
            </motion.div>
          )}

          {state.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {state.error}
            </motion.div>
          )}

          {next && <input type="hidden" name="next" value={next} />}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.email}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                type="email"
                name="email"
                placeholder="admin@dawdicafe.com"
                autoComplete="email"
                required
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:ring-brand"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.password}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:ring-brand"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
              <input
                type="checkbox"
                name="remember"
                value="on"
                defaultChecked
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-brand focus:ring-brand accent-brand"
              />
              {t.remember}
            </label>
            <Link
              href={ADMIN_RESET_PATH}
              className="text-sm text-brand hover:text-brand/80 transition-colors"
            >
              {t.forgot}
            </Link>
          </div>

          <SubmitButton label={t.signIn} pendingLabel={t.signingIn} />

          <Link
            href="/"
            className="block text-center text-sm text-gray-400 hover:text-brand transition-colors"
          >
            ← {t.backToWebsite}
          </Link>
        </form>
      </motion.div>
    </div>
  );
}
