"use client";

import { useState } from "react";
import { BACKOFFICE_PASSPHRASE } from "@/config/backoffice";
import { setBackofficeSession } from "@/lib/backoffice-storage";

type Props = {
  onSuccess: () => void;
};

export function BackofficeLogin({ onSuccess }: Props) {
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passphrase.trim() === BACKOFFICE_PASSPHRASE) {
      setBackofficeSession();
      setError(null);
      onSuccess();
      return;
    }
    setError("Invalid passphrase. Contact Rico for contractor access.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-charcoal-border bg-charcoal-elevated p-8 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-widest text-turquoise">
          Contractor backoffice
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-slate-50">
          Quoting &amp; engine control
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Client-side session only — no database. Enter the contractor passphrase to
          access estimation overrides and proposal previews.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="backoffice-pass"
              className="block text-sm font-medium text-slate-200"
            >
              Passphrase
            </label>
            <input
              id="backoffice-pass"
              type="password"
              autoComplete="current-password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-600 bg-charcoal px-4 py-3 text-slate-50 placeholder:text-slate-500 focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/40"
              placeholder="Enter contractor passphrase"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-300" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-turquoise px-4 py-3 text-sm font-semibold text-white transition hover:bg-turquoise-dark"
          >
            Unlock dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
