import React, { useCallback, useEffect, useMemo, useRef, useState, type JSX } from 'react';
import BaseText from '../Text/BaseText';

interface BaseValidationCodeInputProps {
  value?: string;
  onChange?: (value: string) => void;
  length?: number;
  label?: string;
  placeholder?: string;
  autocomplete?: string;
  error?: string;
  className?: string;
  autoFocusFirstEmpty?: boolean;           // already declared
  onComplete?: (value: string) => void;    // NEW
}

export function BaseValidationCodeInput({
  value,
  onChange,
  length = 6,
  label,
  placeholder,
  autocomplete = 'one-time-code',
  error,
  className = '',
  autoFocusFirstEmpty = false,
  onComplete,
}: BaseValidationCodeInputProps): JSX.Element {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const isControlled = typeof value === 'string';

  const [local, setLocal] = useState<string>(''.padEnd(length, ''));
  const code = (isControlled ? value! : local).slice(0, length).padEnd(length, '');
  const digits = useMemo(() => code.split(''), [code]);

  const setInputRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputsRef.current[index] = el;
    },
    []
  );

  const setCode = useCallback(
    (next: string) => {
      const clean = next.replace(/\D/g, '').slice(0, length);

      // Update value
      if (isControlled) {
        onChange?.(clean);
      } else {
        setLocal(clean.padEnd(length, ''));
        onChange?.(clean);
      }

      // Fire onComplete exactly when reaching full length
      if (clean.length === length) {
        onComplete?.(clean);
      }
    },
    [isControlled, length, onChange, onComplete]
  );

  const focusIndex = (i: number) => {
    const el = inputsRef.current[i];
    if (el) el.focus();
    el?.select?.();
  };

  // Auto-focus the first empty box on mount
  useEffect(() => {
    if (!autoFocusFirstEmpty) return;
    const firstEmpty = digits.findIndex((d) => !d);
    if (firstEmpty >= 0) focusIndex(firstEmpty);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  const handleInput = (idx: number, raw: string) => {
    const v = raw.replace(/\D/g, '');
    if (!v) return;

    const next = digits.slice();
    let cursor = idx;
    for (const ch of v) {
      if (cursor >= length) break;
      next[cursor] = ch;
      cursor += 1;
    }
    setCode(next.join(''));
    const nextFocus = Math.min(cursor, length - 1);
    focusIndex(nextFocus);
  };

  const handleChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === '') {
      const next = digits.slice();
      next[idx] = '';
      setCode(next.join(''));
      return;
    }
    handleInput(idx, v);
  };

  const handleKeyDown = (idx: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    if (key === 'Backspace') {
      e.preventDefault();
      if (digits[idx]) {
        const next = digits.slice();
        next[idx] = '';
        setCode(next.join(''));
        return;
      }
      if (idx > 0) {
        const prev = idx - 1;
        const next = digits.slice();
        next[prev] = '';
        setCode(next.join(''));
        focusIndex(prev);
      }
      return;
    }

    if (key === 'ArrowLeft') {
      e.preventDefault();
      if (idx > 0) focusIndex(idx - 1);
      return;
    }
    if (key === 'ArrowRight') {
      e.preventDefault();
      if (idx < length - 1) focusIndex(idx + 1);
      return;
    }
    if (key.length === 1 && !/\d/.test(key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (idx: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (!text) return;
    const digitsOnly = text.replace(/\D/g, '');
    if (!digitsOnly) return;
    e.preventDefault();

    const next = digits.slice();
    let cursor = idx;
    for (const ch of digitsOnly) {
      if (cursor >= length) break;
      next[cursor] = ch;
      cursor += 1;
    }
    setCode(next.join(''));
    focusIndex(Math.min(cursor, length - 1));
  };

  return (
    <div className={`py-2 ${className}`}>
      {label && (
        <div className="flex justify-center">
          <label className="base-input-label flex">{label}</label>
        </div>
      )}

      <div className="flex justify-center gap-2">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={setInputRef(i)}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={autocomplete}
            aria-label={`Digit ${i + 1}`}
            aria-invalid={!!error}
            className="bg-white p-2 text-dark border rounded-md text-center text-lg w-10"
            placeholder={placeholder && placeholder[i] ? placeholder[i] : ''}
            value={digits[i] ?? ''}
            onChange={handleChange(i)}
            onKeyDown={handleKeyDown(i)}
            onPaste={handlePaste(i)}
            maxLength={1}
          />
        ))}
      </div>

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
