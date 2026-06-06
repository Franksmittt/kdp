export default function BackofficeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="kgp-backoffice-root min-h-screen">{children}</div>;
}
