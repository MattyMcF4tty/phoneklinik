'use client';

import Device from '@schemas/device';
import handleInternalApi from '@utils/api';
import Link from 'next/link';
import React, { FC, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface DeviceSearchFieldProps {
  onSearch?: (value: string) => void;
  placeholder?: string;
}

const DeviceSearchField: FC<DeviceSearchFieldProps> = ({
  onSearch,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [searchResult, setSearchResult] = useState<
    Pick<Device, 'id' | 'brand' | 'model' | 'version'>[]
  >([]);
  const [focused, setFocused] = useState<boolean>(false);

  // Wait 300ms before fetching what the user has searched
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 300);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  useEffect(() => {
    if (debouncedValue.trim() !== '') {
      fetchSearch(debouncedValue);
      if (onSearch) {
        onSearch(debouncedValue);
      }
    }
  }, [debouncedValue, onSearch]);

  async function fetchSearch(search: string) {
    const response = await handleInternalApi('/devices/search', {
      method: 'GET',
      params: { name: search },
    });

    if (response.success === false) {
      toast.error(response.message);
      return;
    }

    setSearchResult(response.data);
  }

  return (
    <search className="relative">
      <input
        className="input-search"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder || 'Find din enhed...'}
        onFocus={() => setFocused(true)}
      />
      <div className="absolute flex flex-col max-h-40 w-full bg-white overflow-x-hidden overflow-y-scroll shadow-lg rounded-b-lg">
        {focused &&
          searchResult.map((device) => (
            <Link
              key={device.id}
              className="hover:bg-blue-50 py-1 px-2 flex flex-wrap"
              href={`/reparation/${device.brand}/${device.model}/${device.version}`}
            >
              {device.brand} {device.model} {device.version}
            </Link>
          ))}
      </div>
    </search>
  );
};

export default DeviceSearchField;
