"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BackofficeLogin } from "@/components/backoffice/BackofficeLogin";
import { EngineOverridePanel } from "@/components/backoffice/EngineOverridePanel";
import { VisualQuoteBuilder } from "@/components/backoffice/visual/VisualQuoteBuilder";
import {
  clearBackofficeSession,
  DEFAULT_STORED_OVERRIDES,
  isBackofficeAuthed,
  loadEngineOverrides,
  saveEngineOverrides,
  type StoredEngineOverrides,
} from "@/lib/backoffice-storage";

export function BackofficeDashboard() {
  const [authed, setAuthed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [engineValues, setEngineValues] =
    useState<StoredEngineOverrides>(DEFAULT_STORED_OVERRIDES);
  const [clientName, setClientName] = useState("");
  const [schemeName, setSchemeName] = useState("");

  useEffect(() => {
    setAuthed(isBackofficeAuthed());
    setEngineValues(loadEngineOverrides());
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.body.classList.add("kgp-backoffice", "vqe-backoffice");
    return () => document.body.classList.remove("kgp-backoffice", "vqe-backoffice");
  }, []);

  useEffect(() => {
    if (hydrated) saveEngineOverrides(engineValues);
  }, [engineValues, hydrated]);

  function handleLogout() {
    clearBackofficeSession();
    setAuthed(false);
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1F2937] text-slate-300">
        Loading…
      </div>
    );
  }

  if (!authed) {
    return <BackofficeLogin onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#1F2937]">
      <header className="border-b border-slate-700 bg-[#111827]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#0D9488]">
              Krugersdorp Painters
            </p>
            <h1 className="font-display text-xl font-semibold text-white">
              Visual quote engine
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-slate-300 hover:text-[#0D9488]">
              ← Public site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-200 hover:border-[#0D9488] hover:text-[#0D9488]"
            >
              Lock session
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <EngineOverridePanel
          values={engineValues}
          onChange={setEngineValues}
          onReset={() => setEngineValues(DEFAULT_STORED_OVERRIDES)}
        />

        <VisualQuoteBuilder
          engineValues={engineValues}
          clientName={clientName}
          schemeName={schemeName}
          onClientChange={setClientName}
          onSchemeChange={setSchemeName}
        />
      </main>
    </div>
  );
}
