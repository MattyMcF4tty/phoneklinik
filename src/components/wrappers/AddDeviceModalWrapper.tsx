"use client"
import AddDeviceModal from '../popUps/AddDevicePopUp';

export default function AddDeviceModalWrapper({
  brand,
  model, 
}: {
  brand: string;
  model?: string;
}) {
  return <AddDeviceModal brand={brand} model={model} />;
}