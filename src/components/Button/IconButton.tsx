import type { IconName } from 'lucide-react/dynamic';
import BaseIcon from '../Icons/BaseIcons';

interface IconButtonProps {
  onClick?: () => void;
  name: IconName;
  color?: string;
  size?: number;
  className?: string;
  circle?: boolean;
  bgColor?: string;
  fill?: string;
}

export function IconButton(props: IconButtonProps) {
  return (
    <>
      <div className="cursor-pointer" onClick={props.onClick}>
        <BaseIcon {...props}></BaseIcon>
      </div>
    </>
  );
}
