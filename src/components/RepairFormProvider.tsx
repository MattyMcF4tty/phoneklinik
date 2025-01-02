'use client';

import { DevicePartSchema } from '@/schemas/devicePartSchema';
import { DeviceSchema } from '@/schemas/deviceScema';
import React, {
  FC,
  ReactNode,
  createContext,
  useContext,
  useState,
} from 'react';

// RepairForm Context Type. This is used to define what data is and should be stored in the context.
interface RepairFormContextType {
  device: DeviceSchema | undefined;
  setDevice: (device: DeviceSchema | undefined) => void;
  selectedParts: DevicePartSchema[];
  setSelectedParts: (selectedParts: DevicePartSchema[]) => void;
}

// RepairForm Context. This is used to store data between child components.
const RepairFormContext = createContext<RepairFormContextType | undefined>(
  undefined
);

// RepairForm Provider Props. This is used to define what arguments the components should have.
interface RepairFormProviderProps {
  children: ReactNode;
}

// RepairForm provider. The component it self. Used to wrap around RepairFormComponents such that they share data.
const RepairFormProvider: FC<RepairFormProviderProps> = ({ children }) => {
  const [device, setDevice] = useState<DeviceSchema | undefined>(undefined); // State for the context
  const [selectedParts, setSelectedParts] = useState<DevicePartSchema[]>([]); // State for the context

  const handleRepairBooking;

  return (
    <RepairFormContext.Provider
      value={{ device, setDevice, selectedParts, setSelectedParts }}
    >
      <form action="">{children}</form>
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
