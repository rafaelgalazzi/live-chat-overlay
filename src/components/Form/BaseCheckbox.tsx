import BaseText from '../Text/BaseText';
import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

export interface BaseCheckboxProps<T extends FieldValues> {
  name?: Path<T>;
  register?: UseFormRegister<T>;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Componente de checkbox baseado no BaseInput.
 * Suporta integração com react-hook-form ou modo controlado via props.
 */
export function BaseCheckbox<T extends FieldValues>({
  name,
  register,
  checked,
  onChange,
  label,
  error,
  className = '',
  disabled,
}: BaseCheckboxProps<T>) {
  // Determina se vai usar register do react-hook-form ou props controladas
  const inputProps =
    register && name
      ? { ...register(name) }
      : {
          checked,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.checked),
        };

  return (
    <div className={`py-2 flex items-start gap-2 ${className}`}>
      <input
        type="checkbox"
        className="w-4 h-4 mt-1 border rounded cursor-pointer"
        disabled={disabled}
        aria-invalid={!!error}
        {...inputProps}
      />
      <div className="flex-1">
        {label && <label className="base-input-label">{label}</label>}
        <div className="mt-1 min-h-[16px] transition-opacity duration-200">
          {error && (
            <BaseText className="text-error text-sm px-1" justify="start">
              {error}
            </BaseText>
          )}
        </div>
      </div>
    </div>
  );
}
