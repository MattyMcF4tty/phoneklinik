"use client"; // Must be the first line

import { useRouter } from "next/navigation"; // App Router-specific useRouter
import { useState } from "react";
import { queryDeviceName } from "@/utils/supabase/devices";

const Searchbar: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter(); // Now imported from next/navigation

  const handleGetDevice = async (name: string) => {
    try {
      const device = await queryDeviceName(name);
      if (device) {
        router.push(`/reparation/${device.brand}/${device.model}/${device.version}`);
      } else {
        alert("Device not found. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching device:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleGetDevice(inputValue.trim());
    }
  };

  return (
    <input
      type="text"
      className="block w-full h-10 p-2 text-gray-900 bg-gray-50 rounded border border-gray-300"
      placeholder="Find din enhed..."
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
};

export default Searchbar;
