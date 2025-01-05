'use client';

import { BookingDataSchema } from '@/schemas/bookingDataSchema';
import { DevicePartSchema } from '@/schemas/devicePartSchema';
import { DeviceSchema } from '@/schemas/deviceScema';
import { bookRepair } from '@/utils/mail';
import { createDateTimeObject } from '@/utils/misc';
import { reserveTimeSlot } from '@/utils/supabase/timeSlots';
import React, {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

// RepairForm Context Type. This is used to define what data is and should be stored in the context.
interface RepairFormContextType {
  device: DeviceSchema | undefined;
  setDevice: (device: DeviceSchema | undefined) => void;
  selectedParts: DevicePartSchema[];
  setSelectedParts: (selectedParts: DevicePartSchema[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  bookingData: BookingDataSchema | undefined;
  setBookingData: (bookingData: BookingDataSchema) => void;
}

// RepairForm Context. This is used to store data between child components.
const RepairFormContext = createContext<RepairFormContextType | undefined>(
  undefined
);

// RepairForm Provider Props. This is used to define what arguments the components should have.
interface RepairFormProviderProps {
  children: ReactNode | undefined;
  deviceData: DeviceSchema | undefined;
}

// RepairForm provider. The component it self. Used to wrap around RepairFormComponents such that they share data.
const RepairFormProvider: FC<RepairFormProviderProps> = ({
  children,
  deviceData,
}) => {
  const [device, setDevice] = useState<DeviceSchema | undefined>(deviceData); // State for the context
  const [selectedParts, setSelectedParts] = useState<DevicePartSchema[]>([]); // State for the context
  const [loading, setLoading] = useState<boolean>(false);
  const [bookingData, setBookingData] = useState<BookingDataSchema | undefined>(
    undefined
  );

  useEffect(() => {
    console.log(bookingData);
  }, [bookingData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log('test');
    setLoading(true);

    if (bookingData && device) {
      const datetime = createDateTimeObject(bookingData.date, bookingData.time);

      try {
        // Reserve time slot
        await reserveTimeSlot(datetime, bookingData.email);

        // Send email for the repair booking
        await bookRepair({
          comment: bookingData.comment,
          date: bookingData.date,
          device: device,
          email: bookingData.email,
          name: bookingData.name,
          phone: bookingData.phone,
          selectedParts: selectedParts,
          time: bookingData.time,
          location: bookingData.location,
        });

        alert('Dit tidspunktet er blevet reserveret!'); // Notify the user that the time has been reserved
        window.location.reload();
      } catch (error) {
        console.error('Error during booking:', error);
        alert('Noget gik galt. Prøv igen senere.');
      }
    } else {
      if (!device) {
        console.error('Missing device:', device);
      }
      if (!bookingData) {
        console.error('Missing bookingData:', bookingData);
      }
      alert('Udfyld venligst alle nødvendige felter.');
    }

    setLoading(false);
  };

  return (
    <RepairFormContext.Provider
      value={{
        device,
        setDevice,
        selectedParts,
        setSelectedParts,
        loading,
        setLoading,
        bookingData,
        setBookingData,
      }}
    >
      <form onSubmit={handleSubmit}>{children}</form>
    </RepairFormContext.Provider>
  );
};

export default RepairFormProvider;

// useRepairForm. This hook is used to get data from context in child components.
export const useRepairForm = (): RepairFormContextType => {
  const context = useContext(RepairFormContext);
  if (!context) {
    throw new Error('useRepairForm must be used within a RepairFormProvider');
  }
  return context;
};
