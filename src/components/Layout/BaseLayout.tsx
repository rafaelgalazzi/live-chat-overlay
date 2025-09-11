export function BaseLayout({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`w-full ${className ?? ""}`}>
      <div className="w-full min-h-screen max-w-md px-2 mx-auto flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
