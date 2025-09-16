import BaseText from '../Text/BaseText';
import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

export interface BaseInputProps<T extends FieldValues> {
  name?: Path<T>;
  register?: UseFormRegister<T>;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  label?: string;
  autocomplete?: string;
  error?: string;
  disabled?: boolean;
}

export function BaseInput<T extends FieldValues>({
  name,
  register,
  value,
  onChange,
  label,
  placeholder,
  type = 'text',
  autocomplete = 'off',
  error,
  disabled,
}: BaseInputProps<T>) {
  const inputProps =
    register && name
      ? { ...register(name) }
      : {
          value,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value),
        };

  return (
    <div className="py-2">
      {label && <label className="base-input-label">{label}</label>}
      <input
        type={type || 'text'}
        placeholder={placeholder || 'Enter text'}
        className={`p-2 text-dark border rounded-md w-full ${disabled ? 'bg-accent' : 'bg-white'}`}
        aria-invalid={!!error}
        autoComplete={autocomplete}
        disabled={disabled}
        {...inputProps}
      />
      <div className="mt-1 min-h-[16px] transition-opacity duration-200">
        {error && (
          <BaseText className="text-error text-sm px-1" justify="start">
            {error}
          </BaseText>
        )}
      </div>
    </div>
  );
}
