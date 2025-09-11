export interface BaseTextProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  justify?: 'start' | 'center' | 'end';
}

export default function BaseText({ children, className, justify = 'center' }: BaseTextProps) {
  return <div className={`text-${justify} font-sizer ${className}`}>{children}</div>;
}
