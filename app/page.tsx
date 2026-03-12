import Link from "next/link";
import EditorPage from "#/components/EditorPage";
import FABs from "#/components/FABs";
import InfoFab from "#/components/InfoFab";
import UpdatesFab from "#/components/UpdatesFab";
import { fetchLatestNotification } from "#/lib/notifications";

export default async function Home() {
  const notification = await fetchLatestNotification();

  return (
    <main>
      <FABs />
      <EditorPage />
      <section className="border-t border-border bg-surface px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-accent">
              SEO Pages
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              SVG logo creation and export guides
            </h2>
            <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
              svglogo.dev is built around a simple workflow: create a clean SVG
              logo in the browser, then export it into the formats real products
              need. These pages cover common search intents around PNG, ICO, and
              favicon outputs while keeping the source asset editable as SVG.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                href: "/svg-to-ico",
                title: "SVG to ICO",
                description:
                  "Favicon, Windows icon, and desktop-app export guidance.",
              },
              {
                href: "/svg-to-png",
                title: "SVG to PNG",
                description:
                  "Transparent raster exports for web, apps, docs, and sharing.",
              },
              {
                href: "/svg-to-favicon",
                title: "SVG to favicon",
                description:
                  "Practical design advice for browser-tab icons that stay readable.",
              },
              {
                href: "/logo-maker",
                title: "Free logo maker",
                description:
                  "The main workflow for building the SVG source artwork first.",
              },
            ].map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="rounded-3xl border border-border bg-background p-5 transition hover:bg-default"
              >
                <h3 className="text-lg font-semibold">{page.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {page.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <UpdatesFab notification={notification} />
      <InfoFab />
    </main>
  );
}
