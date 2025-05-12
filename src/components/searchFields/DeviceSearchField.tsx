'use client';

import Device from '@/schemas/new/device';
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
    const response = await fetch(`/api/devices/search?name=${search}`, {
      method: 'GET',
    });

    const responseJson = await response.json();

    if (!response.ok) {
      throw new Error(responseJson.error);
    }

    setSearchResult(responseJson.data);
    return;
  }

  return (
    <search className="relative">
      <input
        className="w-full outline-none focus:bg-gray-100"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder || 'Search devices...'}
      />
      <div className="absolute flex flex-col max-h-40 w-full bg-white overflow-x-hidden overflow-y-scroll shadow-lg rounded-b-lg">
        {searchResult.map((device) => (
          <Link
            key={device.id}
            className="hover:bg-blue-50 py-1 px-2 flex flex-wrap"
            href={`/dev/reparation/${device.brand}/${device.model}/${device.version}`}
          >
            {device.brand} {device.model} {device.version}
          </Link>
        ))}
      </div>
    </search>
  );
};

export default DeviceSearchField;
