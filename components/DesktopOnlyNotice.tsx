"use client";

import Link from "next/link";
import { useLogoStore } from "#/store/logoStore";
import Footer from "./Footer";
import { LogoCanvas } from "./canvas/LogoCanvas";
import { HomeSeoContent } from "./seo/HomeSeoContent";

export default function DesktopOnlyNotice({ shareId }: { shareId?: string }) {
  const isSharing = !!shareId;

  return (
    <div className="md:hidden">
      <main className="min-h-screen bg-background relative flex flex-col">
        {isSharing ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
            <div className="scale-[0.6] sm:scale-[0.8]">
              <LogoCanvas />
            </div>

            <div className="w-full max-w-sm mt-4">
              <div className="rounded-2xl border border-border bg-surface/50 p-4 flex flex-col gap-3 items-center text-center">
                <p className="text-sm text-muted">
                  This logo was shared with you. Open on desktop to edit or
                  create your own.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
            <div className="rounded-[2rem] border border-border bg-surface p-8 shadow-sm sm:p-12">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-accent">
                Desktop Only
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Open the logo editor on a desktop
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-muted sm:text-lg">
                svglogo.dev works best on desktop, where there is enough space
                for the canvas, controls, and export actions. Open it on a
                laptop or desktop browser to use the full editor.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/logo-maker"
                  className="rounded-2xl bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90"
                >
                  Learn about the logo maker
                </Link>
              </div>
            </div>
          </section>
        )}
        <div className={isSharing ? "pb-32" : ""}>
          <HomeSeoContent />
        </div>
      </main>
      <Footer />
    </div>
  );
}
