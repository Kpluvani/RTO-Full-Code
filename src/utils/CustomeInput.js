import React, { useRef } from 'react';

const MaskedDateInput = ({ value = '', onChange, onEnter, onBlur }) => {
  const inputRef = useRef();

  const formatWithMask = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 8);
    const parts = [];

    if (digits.length > 0) parts.push(digits.slice(0, 2));
    if (digits.length > 2) parts.push(digits.slice(2, 4));
    if (digits.length > 4) parts.push(digits.slice(4, 8));

    return parts.join('/');
  };

  const handleInput = (e) => {
    const masked = formatWithMask(e.target.value);
    if (onChange) onChange(masked);
  };

  const handleKeyDown = (e) => {
    if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab|Enter/.test(e.key)) {
      e.preventDefault();
    }

    if (e.key === 'Enter') {
      if (onEnter) onEnter(inputRef.current?.value);
    }
  };

  return (
    <input
      ref={inputRef}
      placeholder="DD/MM/YYYY"
      value={value}
      onChange={handleInput}
      onKeyDown={handleKeyDown}
      onBlur={onBlur}
      maxLength={10}
      style={{
        width: '100%',
        height: '32px',
        padding: '4px 11px',
        border: '1px solid #d9d9d9',
        borderRadius: 2,
      }}
    />
  );
};

export default MaskedDateInput;
