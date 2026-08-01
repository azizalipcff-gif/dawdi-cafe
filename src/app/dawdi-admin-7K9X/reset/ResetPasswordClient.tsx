"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, KeyRound, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { requestPasswordReset, updatePassword, type ResetState } from "@/lib/actions/auth";
import { useI18n } from "@/lib/i18n/LocaleProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ADMIN_LOGIN_PATH } from "@/lib/constants";
import { SITE_NAME } from "@/lib/constants";

interface ResetPasswordClientProps {
  mode: "request" | "update";
  error?: string;
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

function Shell({ children }: { children: React.ReactNode }) {
  const { dict } = useI18n();
  const t = dict.admin.reset;
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
        {children}
      </motion.div>
    </div>
  );
}

function Alert({ type, children }: { type: "error" | "success"; children: React.ReactNode }) {
  const styles =
    type === "error"
      ? "bg-red-500/10 border-red-500/20 text-red-400"
      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
  const Icon = type === "error" ? AlertCircle : CheckCircle2;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 p-3 rounded-lg border text-sm ${styles}`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {children}
    </motion.div>
  );
}

function RequestForm() {
  const { dict } = useI18n();
  const t = dict.admin.reset;
  const [state, setState] = useState<ResetState>({});

  return (
    <form
      action={async (formData) => setState(await requestPasswordReset(state, formData))}
      className="glass rounded-2xl p-8 space-y-5"
    >
      {state.success && <Alert type="success">{t.linkSent}</Alert>}
      {state.error && <Alert type="error">{state.error}</Alert>}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.email}</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="email"
            name="email"
            placeholder="azizaliyt2ff@gmail.com"
            autoComplete="email"
            required
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:ring-brand"
          />
        </div>
      </div>

      <SubmitButton label={t.sendLink} pendingLabel={t.sending} />

      <Link
        href={ADMIN_LOGIN_PATH}
        className="flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-brand transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.backToSignIn}
      </Link>
    </form>
  );
}

function UpdateForm() {
  const { dict } = useI18n();
  const t = dict.admin.reset;
  const [state, setState] = useState<ResetState>({});
  const [localError, setLocalError] = useState("");

  return (
    <form
      action={async (formData) => {
        const password = String(formData.get("password") ?? "");
        const confirm = String(formData.get("confirm") ?? "");
        if (password !== confirm) {
          setLocalError(t.mismatch);
          return;
        }
        setLocalError("");
        setState(await updatePassword(state, formData));
      }}
      className="glass rounded-2xl p-8 space-y-5"
    >
      {state.error && <Alert type="error">{state.error}</Alert>}
      {localError && <Alert type="error">{localError}</Alert>}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.newPassword}</label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="password"
            name="password"
            placeholder={t.passwordPlaceholder}
            autoComplete="new-password"
            minLength={8}
            required
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:ring-brand"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.confirmPassword}</label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="password"
            name="confirm"
            placeholder={t.confirmPlaceholder}
            autoComplete="new-password"
            minLength={8}
            required
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:ring-brand"
          />
        </div>
      </div>

      <SubmitButton label={t.updatePassword} pendingLabel={t.updating} />

      <Link
        href={ADMIN_LOGIN_PATH}
        className="flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-brand transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.backToSignIn}
      </Link>
    </form>
  );
}

export function ResetPasswordClient({ mode, error }: ResetPasswordClientProps) {
  return (
    <Shell>
      {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}
      {mode === "update" ? <UpdateForm /> : <RequestForm />}
    </Shell>
  );
}
