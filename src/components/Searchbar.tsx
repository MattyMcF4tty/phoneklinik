"use client"; // Must be the first line

import { useRouter } from "next/navigation"; // App Router-specific useRouter
import { useEffect, useState } from "react";
import { queryDeviceName } from "@/utils/supabase/devices";
import Device from "@/schemas/deviceScema";

const Searchbar: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); 

  useEffect(() => {
    const performSearch = async () => {
      await handleSearch(inputValue); // Venter på, at handleSearch afsluttes
    };
  
    if (inputValue) {
      performSearch();
    }
  }, [inputValue]); // Kør, når inputValue ændrer sig

  const handleSearch = async (name: string) => {
    if (!name.trim()) {
      setDevices([]);
      return;
    }
    setIsLoading(true);
    try {
      const fetchedDevices = await queryDeviceName(name);
      setDevices(fetchedDevices);
      console.log(fetchedDevices);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching devices:", error.message);
        alert(`Something went wrong: ${error.message}. Please try again.`);
      } else {
        console.error("An unknown error occurred.");
        alert("An unknown error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  const handleDeviceClick = (device: Device) => {
    console.log(device)
    router.push(`/reparation/${device.brand}/${device.model}/${device.version}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue.trim()) {
      event.preventDefault();
      if (devices.length === 1) {
        handleDeviceClick(devices[0]);
      } else if (devices.length > 1) {
        alert("Multiple devices found. Please select one from the list.");
      } else {
        alert("Device not found. Please refine your search.");
      }
    }
  };

  return (
    <div className="relative w-full">
      {/* Search Bar */}
      <input
        type="text"
        className="block w-full h-10 p-2 text-gray-900 bg-gray-50 rounded border border-gray-300"
        placeholder="Find din enhed..."
        value={inputValue}
        onInput={(e) => {
          const newValue = e.currentTarget.value; // Capture the current value
          setInputValue(newValue); // Update the state
          handleSearch(newValue); // Trigger the search with the updated value
        }}
        onKeyDown={handleKeyDown}
      />

      {/* Dropdown List */}
      {isLoading && <p className="absolute mt-2 text-gray-500">Loading...</p>}
      {!isLoading && devices.length > 0 && (
       <ul className="absolute z-20 mt-2 w-full bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto text-balck">
       {devices.map((device, index) => (
         <li
           key={index}
           className="px-4 py-2 cursor-pointer hover:bg-gray-100"
           onClick={() => handleDeviceClick(device)}
         >
           {device.brand} {device.model} {device.version}
         </li>
       ))}
     </ul>
     
      )}
    </div>
  );
};

export default Searchbar;
