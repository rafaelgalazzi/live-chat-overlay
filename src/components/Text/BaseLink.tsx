interface BaseLinkProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function BaseLink({ children, onClick }: BaseLinkProps) {
  return (
    <>
      <span className="cursor-pointer hover:underline text-link" onClick={onClick}>
        {children}
      </span>
    </>
  );
}
