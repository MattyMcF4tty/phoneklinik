"use client";

import LinkButton from "@/components/LinkButton";
import Navbar from "@/components/Navbar";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function ReparationPage() {
   // Explicitly type the brand and model state
   const [brand, setBrand] = useState<string | "">(""); // brand can be a string or an empty string
   const [model, setModel] = useState<string | "">(""); // model can be a string or an empty string
   const [location, setLocation] = useState<string | "">("");
   // Options for dropdowns
   const brands = ["iPhone", "iPad", "Samsung", "MacBook"];
   const locations = ["Fisketorvet"];
   // Explicitly type models to handle brands and models correctly
   const models: Record<string, string[]> = {
     iPhone: ["iPhone 14", "iPhone 13", "iPhone SE"],
     iPad: ["iPad Pro", "iPad Air", "iPad Mini"],
     Samsung: ["Galaxy S22", "Galaxy Note 20", "Galaxy A52"],
     MacBook: ["MacBook Air", "MacBook Pro"],
   };
   return( 
      <div className="bg-gray-100 h-screen w-full">
        <Navbar />
        <div className="flex items-center justify-center">
          <h1 className="mt-6 mb-8 text-4xl font-bold text-gray-700">PhoneKlinik København</h1>
        </div>
        <div className="flex items-start justify-center">
          {/* Info Box */}
          <div className="flex flex-col bg-white rounded-lg shadow-md p-4 max-w-sm mt-4">
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
          <div className="ml-4 p-4 w-[35rem] mt-4 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-main-purple h-14 to-main-blue p-2 flex items-center rounded-t-lg">
              <h1 className="text-xl text-white font-bold">Vælg din reparation</h1>
            </div>

            {/* Content */}
            <div className="bg-white p-4 rounded-b-lg shadow-md">
              {/* Dropdown for brand */}
              <div className="flex flex-row">
                <select
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    setModel(""); // Reset model when brand changes
                  }}
                  className="bg-gray-200 text-gray-600 w-full py-2 px-4 rounded mb-4 mr-4"
                >
                  <option value="">Vælg mærke</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>

                {/* Dropdown for model */}
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className={`w-full py-2 px-4 rounded mb-4 ${
                    brand ? "bg-gray-200 text-gray-600" : "bg-gray-300 text-gray-400"
                  }`}
                  disabled={!brand}
                >
                  <option value="">Vælg model</option>
                  {brand &&
                    models[brand]?.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                </select>
              </div>

              {/* Dropdown for location */}
              <div className="flex flex-row">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-gray-200 text-gray-600 w-full py-2 px-4 rounded mb-4 mr-4"
                >
                  <option value="">Vælg lokation</option>
                  {locations.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>

                {/* Other input fields */}
                <input
                  type="text"
                  placeholder="Navn"
                  className="w-full py-2 px-4 rounded mb-4 border"
                />
              </div>

              <div className="flex flex-row">
                <input
                  type="date"
                  className="w-full py-2 px-4 rounded mb-4 border mr-4"
                />
                <input
                  type="time"
                  className="w-full py-2 px-4 rounded mb-4 border"
                />
              </div>

              <div className="flex flex-row">
                <input
                  type="tel"
                  placeholder="Telefonnummer"
                  className="w-full py-2 px-4 rounded mb-4 border mr-4"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full py-2 px-4 rounded mb-4 border"
                />
              </div>

              {/* Comment box */}
              <textarea
                placeholder="Evt. kommentar til bestillingen..."
                className="w-full h-24 border rounded-lg p-2 text-gray-600 mt-4"
              />
              <div className="flex items-center justify-center mt-4">
                <LinkButton variant={"navbar2"} url="" className="w-full">
                  Bestil tid
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </div>
   );
}
