"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import LinkButton from "@/components/LinkButton";
import { queryDevices } from "@/utils/supabase/devices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import OrderRepair from "@/components/OrderRepair";

export default function ReparationPage() {
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [versions, setVersions] = useState<string[]>([]);

  const [brand, setBrand] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [version, setVersion] = useState<string>("");

  const [location, setLocation] = useState<string>("");
  const locations = ["Fisketorvet"];

  useEffect(() => {
    // Fetch brands on mount
    const fetchBrands = async () => {
      const devices = await queryDevices({brand: brand, model: model});
      const uniqueBrands = Array.from(new Set(devices.map((device) => device.brand)));
      setBrands(uniqueBrands);
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    // Fetch models when brand changes
    if (brand) {
      const fetchModels = async () => {
        const devices = await queryDevices({ brand });
        const uniqueModels = Array.from(new Set(devices.map((device) => device.model)));
        setModels(uniqueModels);
      };

      fetchModels();
    } else {
      setModels([]);
      setVersions([]);
    }
    setModel(""); // Reset model when brand changes
  }, [brand]);

  useEffect(() => {
    // Fetch versions when model changes
    if (model) {
      const fetchVersions = async () => {
        const devices = await queryDevices({ brand, model });
        const uniqueVersions = Array.from(new Set(devices.map((device) => device.version)));
        setVersions(uniqueVersions);
      };

      fetchVersions();
    } else {
      setVersions([]);
    }
    setVersion(""); // Reset version when model changes
  }, [model]);

  return (
    <div className="bg-gray-100 h-screen w-full">
    <Navbar />
    <div className="flex items-center justify-center">
      <h1 className="mt-6 mb-8 text-4xl font-bold text-gray-700">PhoneKlinik København</h1>
    </div>
    <div className="flex items-start justify-center">
      {/* Info Box */}
      <div className="flex flex-col bg-white rounded-lg shadow-md p-4 w-1/5 mt-4">
        {/* Billede */}
        <img
          src={"phoneklinik.jpg"}
          alt={"billede"}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {/* Tekst */}
        <div className="mt-4">
          <h2 className="text-lg font-bold text-gray-800">Adresse:</h2>
          <p className="text-gray-600 mt-2">Kalvebod Brygge 59 København</p>
          <h2 className="mt-6 text-lg font-bold text-gray-800">Åbningstider:</h2>
          <div className="flex flex-row justify-between">
            <p className="text-gray-600 mt-2">Mandag-Fredag</p>
            <p className="text-gray-600 mt-2">10:00 - 20:00</p>
          </div>
          <div className="flex flex-row justify-between">
            <p className="text-gray-600 mt-2">Lørdag</p>
            <p className="text-gray-600 mt-2">10:00 - 20:00</p>
          </div>
          <div className="flex flex-row justify-between">
            <p className="text-gray-600 mt-2">Søndag</p>
            <p className="text-gray-600 mt-2">10:00 - 20:00</p>
          </div>
          <div className="flex flex-col mt-2">
            <h2 className="mt-6 text-lg font-bold text-gray-800 mb-4">Kontakt:</h2>
            <div className="flex flex-row">
              <FontAwesomeIcon icon={faPhone} className="w-[20px]" />
              <p className="text-gray-600 ml-4">+45 1234 5678</p>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <FontAwesomeIcon icon={faEnvelope} className="mr-4 w-[20px]" />
            <p className="text-gray-600">info@phoneklinik.dk</p>
          </div>
        </div>
      </div>
        {/* Form Box */}
        <OrderRepair/>
        </div>
      </div>
   );
}