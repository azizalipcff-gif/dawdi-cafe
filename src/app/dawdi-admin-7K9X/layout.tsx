// Root admin layout — only a passthrough. The protected shell lives in the
// `(admin)` route group so the login page is not wrapped by it.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
