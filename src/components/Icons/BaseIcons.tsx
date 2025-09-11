import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { type LucideProps } from 'lucide-react';

interface BaseIconProps extends LucideProps {
  name: IconName;
  color?: string;
  size?: number;
  className?: string;
  circle?: boolean;
  bgColor?: string;
  fill?: string;
}

export default function BaseIcon({
  name,
  color,
  size = 20,
  className = '',
  circle = false,
  bgColor = 'text-accent',
  fill,
  ...props
}: BaseIconProps) {
  if (!name) {
    console.warn('BaseIcon: "name" is required.');
    return null;
  }

  const icon = <DynamicIcon name={name} size={size} fill={fill ?? 'none'} color={color ?? 'currentColor'} {...props} />;

  if (!circle) {
    return icon;
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-button text-button-foreground hover:opacity-70 transition-colors duration-300 ${className}`}
      style={{
        backgroundColor: `var(--${bgColor})`,
        width: size + 16,
        height: size + 16,
      }}
    >
      {icon}
    </div>
  );
}
