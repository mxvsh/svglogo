import Link from "next/link";

type FaqItem = {
  question: string;
  answer: string;
};

type SeoLandingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  intro: string[];
  bullets: string[];
  steps: string[];
  useCases: string[];
  faq: FaqItem[];
  primaryCta: {
    href: string;
    label: string;
  };
  relatedPages: Array<{
    href: string;
    label: string;
    description: string;
  }>;
};

export function SeoLandingPage({
  eyebrow,
  title,
  description,
  intro,
  bullets,
  steps,
  useCases,
  faq,
  primaryCta,
  relatedPages,
}: SeoLandingPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-border bg-surface p-8 shadow-sm sm:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-accent">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted sm:text-lg">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={primaryCta.href}
              className="rounded-2xl bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90"
            >
              {primaryCta.label}
            </Link>
            <Link
              href="/"
              className="rounded-2xl border border-border px-5 py-3 text-sm font-medium transition hover:bg-default"
            >
              Open SVG Logo Generator
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-6 sm:px-8 lg:grid-cols-[1.5fr_1fr] lg:px-10">
        <div className="rounded-[1.75rem] border border-border bg-surface p-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            What this page covers
          </h2>
          <div className="mt-5 space-y-4 text-[15px] leading-7 text-muted">
            {intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-border bg-surface p-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            Why use svglogo.dev
          </h2>
          <ul className="mt-5 space-y-3 text-[15px] leading-7 text-muted">
            {bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-6 sm:px-8 lg:grid-cols-2 lg:px-10">
        <div className="rounded-[1.75rem] border border-border bg-surface p-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            How to do it
          </h2>
          <ol className="mt-5 space-y-4 text-[15px] leading-7 text-muted">
            {steps.map((step, index) => (
              <li key={step}>
                <span className="font-semibold text-foreground">
                  {index + 1}.
                </span>{" "}
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-[1.75rem] border border-border bg-surface p-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            Common use cases
          </h2>
          <ul className="mt-5 space-y-4 text-[15px] leading-7 text-muted">
            {useCases.map((useCase) => (
              <li key={useCase}>{useCase}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-6 sm:px-8 lg:px-10">
        <div className="rounded-[1.75rem] border border-border bg-surface p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Related pages
              </h2>
              <p className="mt-2 text-[15px] leading-7 text-muted">
                Explore adjacent SVG export workflows and logo creation pages.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {relatedPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="rounded-2xl border border-border p-5 transition hover:bg-default"
              >
                <p className="font-medium">{page.label}</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {page.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-6 sm:px-8 lg:px-10">
        <div className="rounded-[1.75rem] border border-border bg-surface p-8">
          <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-6 space-y-6">
            {faq.map((item) => (
              <div key={item.question}>
                <h3 className="text-base font-semibold">{item.question}</h3>
                <p className="mt-2 text-[15px] leading-7 text-muted">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
