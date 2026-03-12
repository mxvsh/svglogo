export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface px-6 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted">&copy; {year} svglogo.dev</p>
        <div className="flex items-center gap-5 text-sm">
          <a
            href="https://discord.gg/qjxWBqtYZu"
            target="_blank"
            rel="noreferrer"
            className="text-muted transition hover:text-foreground"
          >
            Discord
          </a>
          <a
            href="https://github.com/mxvsh/svglogo"
            target="_blank"
            rel="noreferrer"
            className="text-muted transition hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="https://x.com/monawwarx"
            target="_blank"
            rel="noreferrer"
            className="text-muted transition hover:text-foreground"
          >
            X
          </a>
        </div>
      </div>
    </footer>
  );
}
