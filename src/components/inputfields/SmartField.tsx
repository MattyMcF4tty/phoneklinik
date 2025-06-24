'use client';

import React, { FC, useState } from 'react';

interface SmartFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suggestions?: string[];
}

const SmartField: FC<SmartFieldProps> = ({ suggestions, ...rest }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (suggestions?.length) {
      const filtered = suggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }

    rest.onChange?.(e);
  };

  return (
    <div>
      <input {...rest} onChange={handleInputChange} />
      {filteredSuggestions?.length > 0 && (
        <ul className="rounded-b-md shadow-md w-full">
          {filteredSuggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SmartField;
