import { LoadingSpinner } from '../Spinner/LoadingSpinner';

export interface BaseButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function BaseButton({ children, onClick, disabled, loading = false, className = '' }: BaseButtonProps) {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!disabled) {
      onClick();
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`bg-white p-2 text-dark border rounded-md min-w-[150px] cursor-pointer
        hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity
        duration-300 flex items-center justify-center gap-2 ${className}`}
    >
      {loading ? <LoadingSpinner /> : children}
    </button>
  );
}
